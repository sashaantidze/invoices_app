import { createStore } from 'vuex'

export default createStore({
  state: {
    InvoiceModal: null,
    ModalActive: null, 
  },

  mutations: {
    TOGGLE_INVOICE(state) {
      state.InvoiceModal = !state.InvoiceModal;
    },

    TOGGLE_MODAL(state) {
      state.ModalActive = !state.ModalActive;
    }
  },
  
  actions: {
  },
  modules: {
  }
})
