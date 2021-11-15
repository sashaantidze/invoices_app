import { createStore } from 'vuex'
import axios from 'axios'

export default createStore({
  state: {
    InvoiceData: [],
    InvoiceModal: null,
    ModalActive: null,
    InvoicesLoaded: null,
  },

  mutations: {
    TOGGLE_INVOICE(state) {
      state.InvoiceModal = !state.InvoiceModal;
    },

    TOGGLE_MODAL(state) {
      state.ModalActive = !state.ModalActive;
    },

    SET_INVOCIE_DATA(state, payload){
      state.InvoiceData.push(payload);
    },

    SET_INVOCIES_LOADED(state){
      state.InvoicesLoaded = true;
    }
  },


  getters: {
    getInvoices (state) {
      return state.InvoiceData
    },

    getModalActive (state) {
      return state.ModalActive
    },

    getInvoiceModal (state) {
      return state.InvoiceModal;
    },

    getInvoicesLoaded (state) {
      return state.InvoicesLoaded;
    },

    getInvoiceData (state) {
      return state.InvoiceData;
    }

  },

  
  actions: {
    async GET_INVOICES({commit, state}) {
      const invoices = await axios.get('/api/v1/invoices');
      console.log(invoices.data);
      commit('SET_INVOCIE_DATA', invoices.data)
      commit('SET_INVOCIES_LOADED')
    }
  },
  modules: {
  }
})
