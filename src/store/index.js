import { createStore } from 'vuex'

export default createStore({
  state: {
    InvoiceModal: null,
  },

  mutations: {
    TOGGLE_INVOICE(state) {
      state.InvoiceModal = !state.InvoiceModal;
    }
  },
  
  actions: {
  },
  modules: {
  }
})
