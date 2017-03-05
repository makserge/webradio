import * as type from '../constants/ActionTypes';

export const addItem = (payload) => {
  return {
    type: type.ADD_WEBRADIO,
    payload
  };
};

export const deleteItem = (payload) => {
  return {
    type: type.DELETE_WEBRADIO,
    payload
  };
};

export const editItem = (payload) => {
  return {
    type: type.EDIT_WEBRADIO,
    payload
  };
};

export const selectItem = (payload) => {
  return {
    type: type.SELECT_WEBRADIO,
    payload
  };
};

export const reorderItem = (payload) => {
  return {
     type: type.REORDER_WEBRADIO,
     payload
   };
}

export const stopItem = (payload) => {
  return {
    type: type.STOP_WEBRADIO,
    payload
  };
}
