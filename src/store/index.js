import { createStore } from 'vuex'
import axios from 'axios'

export default createStore({
  state: {
    InvoiceData: [],
    InvoiceModal: null,
    ModalActive: null,
    InvoicesLoaded: null,
    currentInvoicArray: null
  },

  mutations: {
    TOGGLE_INVOICE(state) {
      state.InvoiceModal = !state.InvoiceModal;
    },

    TOGGLE_MODAL(state) {
      state.ModalActive = !state.ModalActive;
    },

    SET_INVOCIE_DATA(state, payload){
      state.InvoiceData = payload.data;
    },

    PUSH_INVOICE_DATA(state, payload){
      state.InvoiceData.unshift(payload)
    },

    SET_INVOCIES_LOADED(state){
      state.InvoicesLoaded = true;
    },

    SET_CURRENT_INVOICE(state, payload){
      state.currentInvoicArray = state.InvoiceData.filter(invoice => {
        return invoice.uid == payload
      });
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
    },

    getCurrentInvoice (state) {
      return state.currentInvoicArray ? state.currentInvoicArray[0] : null;
    }

  },

  
  actions: {
    async GET_INVOICES({commit, state}) {
      const invoices = await axios.get('/api/v1/invoices');
      commit('SET_INVOCIE_DATA', invoices.data)
      commit('SET_INVOCIES_LOADED')
    }
  },
  modules: {
  }
})
