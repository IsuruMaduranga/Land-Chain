/**
 * CreatePerson Transaction
 * @param {org.landchain.CreateUser} tx
 * @transaction
 */

async function createUser(tx){

    try{
        let reg = await getParticipantRegistry('org.landchain.User');
        let factory = getFactory();
        let user = factory.newResource('org.landchain','User',tx.NIC);
        reg.add(user);
    }
    catch(e){
        throw new Error(e);
    }
    
}

/**
 * RegisterLand Transaction
 * @param {org.landchain.RegisterLand} tx
 * @transaction
 */

async function registerLand(tx){

    try{
        let landReg = await getAssetRegistry('org.landchain.Land');
        let userReg = await getParticipantRegistry('org.landchain.User');
        
        let factory = getFactory();
        let land = factory.newResource('org.landchain','Land',tx.id);
		
      	if(tx.previousLandId){
          land.previousLand = await landReg.get(tx.previousLandId);
        }
        
        let owner = await userReg.get(tx.ownerId);

        land.owner = 

        landReg.add(land);
    }
    catch(e){
        throw new Error(e); 
    }
    
}

/**
 * ChangeOwner Transaction
 * @param {org.landchain.ChangeOwner} tx
 * @transaction
 */

async function changeOwner(tx){

    try{
        let landReg = await getAssetRegistry('org.landchain.Land');
        let userReg = await getParticipantRegistry('org.landchain.User');

        let land = await landReg.get(tx.landId);
        let newOwner = await userReg.get(tx.newOwnerId);

        land.owner =  newOwner

        landReg.update(land);
    }
    catch(e){
        throw new Error(e); 
    }
    
}