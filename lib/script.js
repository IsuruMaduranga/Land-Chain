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