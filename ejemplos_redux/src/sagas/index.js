import { fork, all } from 'redux-saga/effects';

import { watchLoginStarted } from './auth';
import { watchSayHappyBirthday } from './happyBirthday';
import { watchPetOwnersAddStarted,watchPetOwnersFetchStarted,watchPetOwnersDeleteStarted } from './petOwners';


function* mainSaga() {
  yield all([
    fork(watchLoginStarted),
    fork(watchSayHappyBirthday),
    fork(watchPetOwnersAddStarted),
    fork(watchPetOwnersDeleteStarted),
    fork(watchPetOwnersFetchStarted),
  ]);
}


export default mainSaga;
