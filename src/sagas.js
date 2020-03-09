import {
  takeLatest,
  delay
} from 'redux-saga';

import {
  put,
  select
} from 'redux-saga/effects';

const FILESTACK_URL = 'https://process.filestackapi.com/';

const getFromServer = () => {
  console.log(`START SAGAS.JS:getFromServer()`);

  return fetch('/image')
    .then(response => response.json());
  console.log(`FINISHED SAGAS.JS:getFromServer()`);

}

const postToServer = url => {
  console.log(`START SAGAS.JS:postToServer()`);

  return fetch('/image', {
    headers: new Headers({
      'Content-Type': 'application/json'
    }),
    method: 'POST',
    body: JSON.stringify(url)
  })
    .then(response => response.json());
  console.log(`FINISHED SAGAS.JS:postToServer()`);

}

const pick = () => { // pick runs when successful img upload from filepicker
  console.log(`START SAGAS.JS:pick()`);
  return new Promise(function (resolve, reject) {
    filepicker.pick(
      {
        mimetype: 'image/*',
        container: 'modal',
        services: ['COMPUTER', 'FACEBOOK', 'INSTAGRAM', 'URL', 'IMGUR', 'PICASA'],
        openTo: 'COMPUTER'

      },
      function (Blob) {
        console.log(`START SAGAS.JS:pick():blob()`);
        console.log(JSON.stringify(Blob));
        // console.log(JSON.stringify(Blob));
        // console.log(JSON.stringify(Blob));
        // console.log(JSON.stringify(Blob));
        // console.log(JSON.stringify(Blob));

        const handler = Blob.url.substring(Blob.url.lastIndexOf('/') + 1);
        resolve(handler);
        console.log(`FINISHED SAGAS.JS:pick():blob()`);
      },
      function (FPError) {
        console.log(FPError.toString());
        reject(FPError.toString());
      }
    );
  });
  console.log(`FINISHED SAGAS.JS:pick()`);

}

function* loadImages() {
  try {
    console.log(`START SAGAS.JS:loadImages()`);
    yield delay(1000);
    const imageList = yield getFromServer();
    yield put({ type: 'GET_IMAGES_SUCCESS', payload: imageList });
  } catch (error) {
    yield put({ type: 'GET_IMAGES_FAILURE' });
  }
  console.log(`FINISHED SAGAS.JS:loadImages()`);

}

function* postImage() {
  try {
    console.log(`START SAGAS.JS:postImage ()`);
    yield delay(1000);
    const state = yield select();
    const url = FILESTACK_URL + state.get(' ').get('filters') + state.get('upload').get('handle');
    const result = yield postToServer({ url });
    yield put({ type: 'POST_IMAGE_SUCCESS' });

  } catch (error) {
    yield put({ type: 'POST_IMAGE_FAILURE' });
  }
  console.log(`FINISHED SAGAS.JS:postImage ()`);

}

function* uploadImage() {
  console.log(`START SAGAS.JS:uploadImage()`);
  try {
    const upload = yield pick();
    yield put({ type: 'UPLOAD_IMAGE_SUCCESS', payload: upload });
  } catch (error) {
    yield put({ type: 'UPLOAD_IMAGE_FAILURE' });
  }
  console.log(`FINISHED SAGAS.JS:uploadImage ()`);

}

function* watchGetImages() {
  console.log(`START SAGAS.JS:uploadImage()`);
  yield takeLatest('GET_IMAGES', loadImages);
  console.log(`FINISHED SAGAS.JS:uploadImage ()`);
}

function* watchPostImage() {
  console.log(`START SAGAS.JS:uploadImage()`);

  yield takeLatest('POST_IMAGE', postImage);
  console.log(`FINISHED SAGAS.JS:uploadImage ()`);

}

function* watchFilestack() {
  console.log(`START SAGAS.JS:uploadImage()`);

  yield takeLatest('UPLOAD_IMAGE', uploadImage);
  console.log(`FINISHED SAGAS.JS:uploadImage ()`);
}


// rootSaga is es6 module, ES6 modules form their own file scope
// Each module is a piece of code that is executed once it is loaded.
// can export basically anything :functions, objects, classes, probably primitive values
export default function* rootSaga() {
  console.log(`START SAGAS.JS:rootSaga()`);
  yield [
    watchGetImages(),
    watchPostImage(),
    watchFilestack()
  ]
  console.log(`FINISHED SAGAS.JS:rootSaga()`);

}
