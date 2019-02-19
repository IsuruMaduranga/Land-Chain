/**
 * CreatePerson Transaction
 * @param {org.landchain.CreatePerson} tx
 * @transaction
 */

async function createPerson(tx){

    try{
        let reg = await getParticipantRegistry('org.landchain.Person');
        let factory = getFactory();
        let person = factory.newResource('org.landchain','Person',tx.NIC);
        reg.add(person);
    }
    catch(e){
        throw new Error(e);
    }
    
}

