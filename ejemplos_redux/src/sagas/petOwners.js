import {
  call,
  takeEvery,
  put,
  // race,
  // all,
  delay,
  select,
} from 'redux-saga/effects';

import * as selectors from '../reducers';
import * as actions from '../actions/petOwners';
import * as types from '../types/petOwners';


const API_BASE_URL = 'http://localhost:8000/api/v1';

//Al empezar un add
function* fetchPetOwners(action) {
  try {
    const isAuth = yield select(selectors.isAuthenticated);

    if (isAuth) {
      const token = yield select(selectors.getAuthToken);
      ///////////////////////////////////////////////////////////////////////
      const userID = yield select(selectors.getAuthUserID);
      const expiration = yield select(selectors.getAuthExpiration);
      const now = parseInt(Date.now() / 1000);
      console.log("Expiration: ", expiration);
      console.log("Now:", now);
      console.log("Difference:", expiration - now);
      ///////////////////////////////////////////////////////////////////////
      const response = yield call(
        fetch,
        `${API_BASE_URL}/owners/`,
        {
          method: 'GET',
          body: JSON.stringify({}),
          headers:{
            'Content-Type': 'application/json',
            'Authorization': `JWT ${token}`,
          },
        }
      );

      if (response.status === 200) {
        const petOwnersList = yield response.json();
        const order =  petOwnersList.map((petOwner)=>petOwner.id);
        let byIdEntities ={};
        petOwnersList.forEach(petOwner=>{
          byIdEntities[petOwner.id]=petOwner;
        })
        yield put(actions.completeFetchingPetOwners(byIdEntities,order));
      } else {
        const { non_field_errors } = yield response.json();
        yield put(actions.failFetchingPetOwners(non_field_errors[0]));
      }
    }else{
      yield put(actions.failFetchingPetOwners('Hsuario no está autenticado.'));
    }
  } catch (error) {
     yield put(actions.failFetchingPetOwners(error));
  }
}

//Al empezar un add
function* addPetOwner(action) {
  try {
    const isAuth = yield select(selectors.isAuthenticated);
    const petOwner = action.payload;
    if (isAuth) {
      const token = yield select(selectors.getAuthToken);
      ///////////////////////////////////////////////////////////////////////
      const userID = yield select(selectors.getAuthUserID);
      const expiration = yield select(selectors.getAuthExpiration);
      const now = parseInt(Date.now() / 1000);
      console.log("Expiration: ", expiration);
      console.log("Now:", now);
      console.log("Difference:", expiration - now);
      ///////////////////////////////////////////////////////////////////////
      const response = yield call(
        fetch,
        `${API_BASE_URL}/owners/`,
        {
          method: 'POST',
          body: JSON.stringify(petOwner),
          headers:{
            'Content-Type': 'application/json',
            'Authorization': `JWT ${token}`,
          },
        }
      );

      if (response.status === 200) {
        const newPetOwner = yield response.json();
        yield put(actions.completeAddingPetOwner(petOwner.oldId,newPetOwner));
      } else {
        const { non_field_errors } = yield response.json();
        yield put(actions.failAddingPetOwner(petOwner.oldId,non_field_errors[0]));
      }
    }else{
      yield put(actions.failAddingPetOwner(petOwner.oldId,'Usuario no está autenticado.'));
    }
  } catch (error) {
    yield put(actions.failAddingPetOwner(petOwner.oldId,error));
  }
}

//Al empezar un delete
function* deletePetOwner(action) {
  try {
    const isAuth = yield select(selectors.isAuthenticated);
    const idPetOwner = action.payload;
    if (isAuth) {
      const token = yield select(selectors.getAuthToken);
      ///////////////////////////////////////////////////////////////////////
      const userID = yield select(selectors.getAuthUserID);
      const expiration = yield select(selectors.getAuthExpiration);
      const now = parseInt(Date.now() / 1000);
      console.log("Expiration: ", expiration);
      console.log("Now:", now);
      console.log("Difference:", expiration - now);
      ///////////////////////////////////////////////////////////////////////
      const response = yield call(
        fetch,
        `${API_BASE_URL}/owners/${idPetOwner}/`,
        {
          method: 'DELETE',
          body: JSON.stringify(petOwner),
          headers:{
            'Content-Type': 'application/json',
            'Authorization': `JWT ${token}`,
          },
        }
      );

      if (response.status === 200) {
    
        yield put(actions.completeRemovingPetOwner());
      } else {
        const { non_field_errors } = yield response.json();
        yield put(actions.failRemovingPetOwner(petOwnerId,non_field_errors[0]));
      }
    }else{
      yield put(actions.failRemovingPetOwner(petOwnerId,'Usuario no está autenticado.'));
    }
  } catch (error) {
    yield put(actions.failRemovingPetOwner(petOwnerId,error));
  }
}


//Funciones watcher

//Ver fetch started
export function* watchPetOwnersFetchStarted() {
  yield takeEvery(
    types.PET_OWNERS_FETCH_STARTED,
    fetchPetOwners,
  );
}

//Ver add started
export function* watchPetOwnersAddStarted() {
  yield takeEvery(
    types.PET_OWNER_ADD_STARTED,
    addPetOwner,
  );
}

//Ver remove started
export function* watchPetOwnersDeleteStarted() {
  yield takeEvery(
    types.PET_OWNER_REMOVE_STARTED,
    deletePetOwner,
  );
}