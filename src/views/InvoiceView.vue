<template>
    <div class="invoice-view container">
        <router-link class="nav-link flex" :to="{name: 'Home'}">
        	<img src="@/assets/icon-arrow-left.svg" alt=""> Go Back
        </router-link>

        <!-- Header -->
        <div class="header flex">
        	<div class="left flex">
        		<span>Status</span>

    			<div class="status-button flex"
                    :class="{
                        paid: currentInvoice.invoice_paid,
                        draft: currentInvoice.invoice_draft && !currentInvoice.invoice_paid,
                        pending: !currentInvoice.invoice_paid && !currentInvoice.invoice_draft}">

                    <span v-if="currentInvoice.invoice_paid">Paid</span>
                    <span v-if="currentInvoice.invoice_draft && !currentInvoice.invoice_paid">Draft</span>
                    <span v-if="!currentInvoice.invoice_paid && !currentInvoice.invoice_draft">Pending</span>
                    
                </div>

        	</div>

        	<div class="right flex">
        		<button @click="toggleEditInvoice" class="dark-purple">Edit</button>
        		<button @click="deleteInvoice" class="red">Delete</button>
        		<button @click="updateInvoiceStatus" v-if="!currentInvoice.invoice_paid && !currentInvoice.invoice_draft" class="green">Mark as Paid</button>
        		<button @click="updateInvoiceStatus" v-if="currentInvoice.invoice_draft || currentInvoice.invoice_paid" class="orange">Mark as Pending</button>
        	</div>
        </div>


        <!-- Invoice Details -->
        <div class="invoice-details flex flex-column">
        	<div class="top flex">

        		<div class="left flex flex-column">
        			<p><span>#</span>{{currentInvoice.uid}}</p>
        			<p>{{currentInvoice.description}}</p>
        		</div>

        		<div class="right flex flex-column">
        			<p>{{currentInvoice.biller_data.street_address}}</p>
        			<p>{{currentInvoice.biller_data.city}}</p>
        			<p>{{currentInvoice.biller_data.zip_code}}</p>
        			<p>{{currentInvoice.biller_data.country}}</p>
        		</div>
        	</div>

        	<div class="middle flex">
        		<div class="payment flex flex-column">
        			<h4>Invoice Date</h4>
        			<p>
        				{{currentInvoice.invoice_date}}
        			</p>

        			<h4>Payment Date</h4>
        			<p>
        				{{currentInvoice.invoice_payment_due}}
        			</p>
        		</div>

        		<div class="bill flex flex-column">
        			<h4>Bill To</h4>
        			<p>{{currentInvoice.client_data.name}}</p>
        			<p>{{currentInvoice.client_data.street_address}}</p>
        			<p>{{currentInvoice.client_data.city}}</p>
        			<p>{{currentInvoice.client_data.zip_code}}</p>
        			<p>{{currentInvoice.client_data.country}}</p>
        		</div>
        		<div class="send-to flex flex-column">
        			<h4>Send To</h4>
        			<p>{{currentInvoice.client_data.email}}</p>
        		</div>
        	</div>

        	<div class="bottom flex flex-column">
        		<div class="billing-items">
        			<div class="heading flex">
        				<p>Item Name</p>
        				<p>QTY</p>
        				<p>Price</p>
        				<p>Total</p>
        			</div>


        			<div v-for="(item, index) in currentInvoice.items" :key="item.uid" class="item flex">
        				<p>{{ item.name }}</p>
				        <p>{{ item.qty }}</p>
				        <p>{{ item.price }}</p>
				        <p>{{ formatPriceAmount(item.total) }}</p>
        			</div>
        		</div>

        		<div class="total flex">
        			<p>Amount Due</p>
        			<p>{{formatPriceAmount(currentInvoice.itemsTotal)}}</p>
        		</div>
        	</div>
        </div>

    </div>
</template>

<script>
import {mapMutations, mapGetters, mapActions} from 'vuex'
import InvoiceItem from '@/components/InvoiceItem'
import axios from 'axios'
export default {
	name: "InvoiceView",

	components: {
		InvoiceItem
	},

	data() {
		return {
			invoice: null
		}
	},

	methods: {
		...mapMutations({
			setCurrentInvoice: 'SET_CURRENT_INVOICE',
      editInvoiceModal: 'TOGGLE_EDIT_INVOICE',
      invoiceModal: 'TOGGLE_INVOICE',
		}),

    ...mapActions({
      deleteInvoiceAction: 'DELETE_INVOICE'
    }),

		getInvoice(){
			this.setCurrentInvoice(this.$route.params.invoiceId);
		},

		formatPriceAmount(price){
			return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'GEL' }).format(price)
		},


    toggleEditInvoice(){
      this.editInvoiceModal()
      this.invoiceModal()
    },


    deleteInvoice(){
      let uid = this.currentInvoice.uid
      if(!confirm('Sure to proceed deleting invoice: #'+uid+'?')) return;
      this.deleteInvoiceAction(uid).then(() => {
        this.$router.push({ name: 'Home' })
      })
    },

    async updateInvoiceStatus(){
      if(!confirm('Update invoice status?')) return;

      try{
        await axios.post('api/v1/paid', {uid: this.currentInvoice.uid}).then((e) => {
          this.currentInvoice.invoice_paid = e.data.invoice_paid
          this.currentInvoice.invoice_draft = e.data.invoice_draft
        })
      }
      catch(e){
        console.log(e.response)
        if(e.response.status === 404){
          alert(e.response.data.message)
        }
      }
    },


	},


	computed: {
		...mapGetters({
			currentInvoice: 'getCurrentInvoice'
		}),

	},


	created() {
		this.getInvoice()
	}


}
</script>

<style lang="scss" scoped>
.invoice-view {
  .nav-link {
    margin-bottom: 32px;
    align-items: center;
    color: #fff;
    font-size: 12px;
    img {
      margin-right: 16px;
      width: 7px;
      height: 10px;
    }
  }
  .header,
  .invoice-details {
    background-color: #1e2139;
    border-radius: 20px;
  }
  .header {
    align-items: center;
    padding: 24px 32px;
    font-size: 12px;
    .left {
      align-items: center;
      span {
        color: #dfe3fa;
        margin-right: 16px;
      }
    }
    .right {
      flex: 1;
      justify-content: flex-end;
      button {
        color: #fff;
      }
    }
  }
  .invoice-details {
    padding: 48px;
    margin-top: 24px;
    .top {
      div {
        color: #dfe3fa;
        flex: 1;
      }
      .left {
        font-size: 12px;
        p:first-child {
          font-size: 24px;
          text-transform: uppercase;
          color: #fff;
          margin-bottom: 8px;
        }
        p:nth-child(2) {
          font-size: 16px;
        }
        span {
          color: #888eb0;
        }
      }
      .right {
        font-size: 12px;
        align-items: flex-end;
      }
    }
    .middle {
      margin-top: 50px;
      color: #dfe3fa;
      gap: 16px;
      h4 {
        font-size: 12px;
        font-weight: 400;
        margin-bottom: 12px;
      }
      p {
        font-size: 16px;
      }
      .bill,
      .payment {
        flex: 1;
      }
      .payment {
        h4:nth-child(3) {
          margin-top: 32px;
        }
        p {
          font-weight: 600;
        }
      }
      .bill {
        p:nth-child(2) {
          font-size: 16px;
        }
        p:nth-child(3) {
          margin-top: auto;
        }
        p {
          font-size: 12px;
        }
      }
      .send-to {
        flex: 2;
      }
    }
    .bottom {
      margin-top: 50px;
      .billing-items {
        padding: 32px;
        border-radius: 20px 20px 0 0;
        background-color: #252945;
        .heading {
          color: #dfe3fa;
          font-size: 12px;
          margin-bottom: 32px;
          p:first-child {
            flex: 3;
            text-align: left;
          }
          p {
            flex: 1;
            text-align: right;
          }
        }
        .item {
			background: #111534;
			padding: 7px;
			border-radius: 10px;
          margin-bottom: 32px;
          font-size: 13px;
          color: #fff;
          &:last-child {
            margin-bottom: 0;
          }
          p:first-child {
            flex: 3;
            text-align: left;
          }
          p {
            flex: 1;
            text-align: right;
          }
        }
      }
      .total {
        color: #fff;
        padding: 32px;
        background-color: rgba(12, 14, 22, 0.7);
        align-items: center;
        border-radius: 0 0 20px 20px;
        p {
          flex: 1;
          font-size: 12px;
        }
        p:nth-child(2) {
          font-size: 28px;
          text-align: right;
        }
      }
    }
  }
}
</style>
