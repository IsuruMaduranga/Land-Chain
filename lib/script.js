/**
 * CreatePerson Transaction
 * @param {org.landchain.CreateUser} tx
 * @transaction
 */

async function createUser(tx) {

    try {
        let reg = await getParticipantRegistry('org.landchain.User');

        if (!(await reg.exists(tx.NIC))) {
            let factory = getFactory();
            let user = factory.newResource('org.landchain', 'User', tx.NIC);
            reg.add(user);
        }
    } catch (e) {
        throw new Error(e);
    }

}

/**
 * RegisterLand Transaction
 * @param {org.landchain.RegisterLand} tx
 * @transaction
 */

async function registerLand(tx) {

    try {

        let landReg = await getAssetRegistry('org.landchain.Land');
        let userReg = await getParticipantRegistry('org.landchain.User');
        let factory = getFactory();

        let land = factory.newResource('org.landchain', 'Land', tx.id);
        land.owner = await userReg.get(tx.ownerId);
        land.regTime = new Date();
        return landReg.add(land);

    } catch (e) {
        throw new Error(e.message);
    }

}

/**
 * ChangeOwner Transaction
 * @param {org.landchain.ChangeOwner} tx
 * @transaction
 */

async function changeOwner(tx) {

    try {
        let landReg = await getAssetRegistry('org.landchain.Land');
        let userReg = await getParticipantRegistry('org.landchain.User');
        let land = await landReg.get(tx.landId);

        if (land.status !== "VALID") {
            throw new Error('Owner cannot be changed');
        }

        let newOwner = await userReg.get(tx.newOwnerId);
        land.owner = newOwner
        return landReg.update(land);
    } catch (e) {
        throw new Error(e);
    }

}

/**
 * DivideLand Transaction
 * @param {org.landchain.DivideLand} tx
 * @transaction
 */

async function divideLand(tx) {

    try {
        let landReg = await getAssetRegistry('org.landchain.Land');

        if (!(await landReg.exists(tx.oldLandId))) {
            throw new Error('Land not exists')
        }

        let land = await landReg.get(tx.oldLandId);
        let factory = getFactory();

        let lands = [];

        tx.newIds.forEach(id => {
            l = factory.newResource('org.landchain', 'Land', id);
            l.owner = land.owner;
            l.regTime = new Date();
            l.previousLand = land;
            lands.push(l);
        });

        land.status = 'DIVIDED'
        await landReg.update(land);

        return landReg.addAll(lands);

    } catch (e) {
        throw new Error(e);
    }

}

/**
 * get land history transaction
 * @param {org.landchain.getLandHistory} tx
 * @returns {String[]}
 * @transaction
 */

async function getLandHistory(tx) {
    const id = tx.id;
    const nativeSupport = tx.nativeSupport;

    const nativeKey = getNativeAPI().createCompositeKey('Asset:org.landchain.Land', [id]);
    const iterator = await getNativeAPI().getHistoryForKey(nativeKey);
    let results = [];
    let res = {done : false};
    while (!res.done) {
        res = await iterator.next();

        if (res && res.value && res.value.value) {
            let val = res.value.value.toString('utf8');
            if (val.length > 0) {
               console.log("@debug val is  " + val );
               results.push(JSON.parse(val));
            }
        }
        if (res && res.done) {
            try {
                iterator.close();
            }
            catch (err) {
            }
        }
    }
    var newArray = [];
    for (const item of results) {
            newArray.push(getSerializer().fromJSON(item));
    }

    return newArray; 
}

/**
 * get land history transaction
 * @param {org.landchain.getLandsByNIC} tx
 * @returns {Land[]}
 * @transaction
 */

async function getLandsByNIC(tx) {
    user = `resource:org.landchain.User#${tx.NIC}`
    let results = await query('selectLandsByOwner',{owner:user});
    return results;
}

