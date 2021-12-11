<template>
	
	<div @click="checkClick" ref="invoiceWrap" class="invoice-wrap flex flex-column">
		<form @submit.prevent="submitForm" class="invoice-content">

			<Loading v-show="loading" />

			<h1 v-if="!editInvoice">New Invoice</h1>
			<h1 v-else>Edit Invoice <span v-if="invoiceToEdit"> - #{{invoiceToEdit.uid}}</span></h1>

			<div class="bill-from flex flex-column">
				<h4>Bill From</h4>
				<div class="input flex flex-column">
					<label for="billerStreetAddress">Street Address</label>
					<input required type="text" id="billerStreetAddress" v-model="invoiceData.billerStreetAddress">
				</div>

				<div class="location-details flex">
					<div class="input flex flex-column">
						<label for="billerCity">City</label>
						<input required type="text" id="billerCity" v-model="invoiceData.billerCity">
					</div>

					<div class="input flex flex-column">
						<label for="billerZipCode">Zip Code</label>
						<input required type="text" id="billerZipCode" v-model="invoiceData.billerZipCode">
					</div>

					<div class="input flex flex-column">
						<label for="billerCountry">Country</label>
						<input required type="text" id="billerCountry" v-model="invoiceData.billerCountry">
					</div>
				</div>
			</div>

			<!-- Bill To -->
			<div class="bill-to flex flex-column">
				<h4>Bill To</h4>
				<div class="input flex flex-column">
					<label for="clientName">Client's Name</label>
					<input required type="text" id="clientName" v-model="invoiceData.clientName" />
				</div>
				<div class="input flex flex-column">
					<label for="clientEmail">Client's Email</label>
					<input required type="text" id="clientEmail" v-model="invoiceData.clientEmail" />
				</div>
				<div class="input flex flex-column">
					<label for="clientStreetAddress">Street Address</label>
					<input required type="text" id="clientStreetAddress" v-model="invoiceData.clientStreetAddress" />
				</div>
				<div class="location-details flex">
					<div class="input flex flex-column">
						<label for="clientCity">City</label>
						<input required type="text" id="clientCity" v-model="invoiceData.clientCity" />
					</div>
					<div class="input flex flex-column">
						<label for="clientZipCode">Zip Code</label>
						<input required type="text" id="clientZipCode" v-model="invoiceData.clientZipCode" />
					</div>
					<div class="input flex flex-column">
						<label for="clientCountry">Country</label>
						<input required type="text" id="clientCountry" v-model="invoiceData.clientCountry" />
					</div>
				</div>
			</div>



			<!-- Invoice Work Details -->
			<div class="invoice-work flex flex-column">
				<div class="payment flex">
					<div class="input flex flex-column">
						<label for="invoiceDate">Invoice Date</label>
						<input disabled type="text" id="invoiceDate" v-model="invoiceDate" />
					</div>
					<div class="input flex flex-column">
						<label for="paymentDueDate">Payment Due</label>
						<input disabled type="text" id="paymentDueDate" v-model="invoiceData.paymentDueDate" />
					</div>
				</div>
				<div class="input flex flex-column">
					<label for="paymentTerms">Payment Terms</label>
					<select :required="!editInvoice" id="paymentTerms" v-model="paymentTerms">
						<option value="30">Net 30 Days</option>
						<option value="60">Net 60 Days</option>
					</select>
				</div>
				<div class="input flex flex-column">
					<label for="productDescription">Product Description</label>
					<input required type="text" id="productDescription" v-model="invoiceData.productDescription" />
				</div>
				<div class="work-items">
					<h3>Item List</h3>
					<table class="item-list">
						<tr class="table-heading flex">
							<th class="item-name">Item Name</th>
							<th class="qty">Qty</th>
							<th class="price">Price</th>
							<th class="total">Total</th>
						</tr>
						<tr class="table-items flex" v-for="(item, index) in invoiceData.invoiceItemList" :key="index">
							<td class="item-name"><input type="text" v-model="item.name" /></td>
							<td class="qty"><input type="number" v-model="item.qty" /></td>
							<td class="price"><input type="number" v-model="item.price" /></td>
							<td class="total flex">${{ (item.total = item.qty * item.price) }}</td>
							<img class="item-delete-btn" @click="deleteInvoiceItem(item.uid)" src="@/assets/icon-delete.svg" alt="" />
						</tr>
					</table>

					<div @click="addNewInvoiceItem" class="flex button">
						<img src="@/assets/icon-plus.svg" alt="" />
						Add New Item
					</div>
				</div>
			</div>


			<div class="save flex">
				<div class="left">
					<button type="button" @click="closeInvoice" class="red">Cancel</button>
				</div>
				<div class="right flex">
					<button v-if="!editInvoice" type="submit" @click="saveDraft" class="dark-purple">Save Draft</button>
					<button v-if="!editInvoice" type="submit" @click="publishInvoice" class="purple">Create Invoice</button>
					<button v-if="editInvoice" type="submit" class="purple">Update Invoice</button>
				</div>
			</div>


		</form>
	</div>

</template>

<script>

import {uid} from 'uid'
import {mapMutations, mapGetters, mapActions} from 'vuex'
import axios from 'axios'
import Loading from '@/components/Loading' 

export default {
	name: "InvoiceModal",

	components: {
		Loading
	},

	data () {
		return {
			dateOptions: { year: 'numeric', month: 'short', day: 'numeric' },
			errors: {},
			loading: false,
			paymentTerms: null,
			invoiceDate: null,
			invoicePending: null,
			invoiceDraft: null,
			invoiceTotal: 0,
			invoiceDateUnix: null,

			invoiceData: {
				billerStreetAddress: null,
				billerCity: null,
				billerZipCode: null,
				billerCountry: null,
				clientName: null,
				clientEmail: null,
				clientStreetAddress: null,
				clientCity: null,
				clientZipCode: null,
				clientCountry: null,
				paymentDueDateUnix: null,
				paymentDueDate: null,
				productDescription: null,
				invoiceItemList: [],
			}
			
		}
	},


	methods: {

		...mapMutations({
			toggleInvoice: 'TOGGLE_INVOICE',
			toggleModal: 'TOGGLE_MODAL',
			pushNewInvoice: 'PUSH_INVOICE_DATA',
			toggleEditInvoice: 'TOGGLE_EDIT_INVOICE',
			deleteInvoice: 'REMOVE_INVOICE',
			setCurrentInvoice: 'SET_CURRENT_INVOICE'
		}),


		checkClick(e) {
			if(e.target === this.$refs.invoiceWrap){
				if(!this.canBeClosed()){
					this.toggleModal();
					return;
				}
				
				this.toggleInvoice();

				if(this.editInvoice){
	        this.toggleEditInvoice()
	      }
				
			}
		},


		closeInvoice() {
			if(!this.canBeClosed()){
					this.toggleModal();
					return;
				}
				
				this.toggleInvoice();

				if(this.editInvoice){
	        this.toggleEditInvoice()
	      }
		},


		canBeClosed(){
			for (let prop in this.invoiceData) {
				let object = this.invoiceData[prop];
					if(prop === 'invoiceItemList'){
						return (object.length ? false : true);
					}
					else{
						if(object != null){
							return false;
						}
					}
			}

			return true;

		},


		addNewInvoiceItem() {
			this.invoiceData.invoiceItemList.push({
				uid: uid(),
				name: "",
				qty: "",
				price: 0,
				total: 0,
			})
		},

		deleteInvoiceItem (uid) {
			this.invoiceData.invoiceItemList = this.invoiceData.invoiceItemList.filter((item) => item.uid != uid );
		},

		publishInvoice () {
			this.invoicePending = true;
		},

		saveDraft () {
			this.invoiceDraft = true;
		},


		calcInvoiceTotal() {
			this.invoiceTotal = 0;
			this.invoiceData.invoiceItemList.forEach(item => {
				this.invoiceTotal += item.total;
			})
		},

		async uploadInvoice() {
			if(this.invoiceData.invoiceItemList.length <= 0){
				alert('Please make sure you add work items');
				return;
			}

			this.loading = true;

			this.calcInvoiceTotal()

			try{
				await axios.post('/api/v1/invoice', {
					invoiceId: uid(6),
	        billerStreetAddress: this.invoiceData.billerStreetAddress,
	        billerCity: this.invoiceData.billerCity,
	        billerZipCode: this.invoiceData.billerZipCode,
	        billerCountry: this.invoiceData.billerCountry,
	        clientName: this.invoiceData.clientName,
	        clientEmail: this.invoiceData.clientEmail,
	        clientStreetAddress: this.invoiceData.clientStreetAddress,
	        clientCity: this.invoiceData.clientCity,
	        clientZipCode: this.invoiceData.clientZipCode,
	        clientCountry: this.invoiceData.clientCountry,
	        invoiceDate: this.invoiceDate,
	        invoiceDateUnix: this.invoiceDateUnix,
	        paymentTerms: this.invoiceData.paymentTerms,
	        paymentDueDate: this.invoiceData.paymentDueDate,
	        paymentDueDateUnix: this.invoiceData.paymentDueDateUnix,
	        productDescription: this.invoiceData.productDescription,
	        invoiceItemList: this.invoiceData.invoiceItemList,
	        invoiceTotal: this.invoiceData.invoiceTotal,
	        invoicePending: this.invoiceData.invoicePending,
	        invoiceDraft: this.invoiceData.invoiceDraft,
	        invoicePaid: null,
				}).then((e) => {
					this.pushNewInvoice(e.data)
				})
				this.loading = false;
				this.toggleInvoice()
			}
			catch (e) {
				if(e.response.status === 422){
					this.loading = false;
					this.errors = e.response.data.errors
				}

			}
			
		},

		async updateInvoice(){
			if(this.invoiceData.invoiceItemList.length <= 0){
				alert('Please make sure you add work items');
				return;
			}

			this.loading = true;

			this.calcInvoiceTotal()

			try{
				await axios.put(`/api/v1/invoice/${this.invoiceToEdit.uid}`, {
					invoiceId: this.invoiceToEdit.uid,
	        billerStreetAddress: this.invoiceData.billerStreetAddress,
	        billerCity: this.invoiceData.billerCity,
	        billerZipCode: this.invoiceData.billerZipCode,
	        billerCountry: this.invoiceData.billerCountry,
	        clientName: this.invoiceData.clientName,
	        clientEmail: this.invoiceData.clientEmail,
	        clientStreetAddress: this.invoiceData.clientStreetAddress,
	        clientCity: this.invoiceData.clientCity,
	        clientZipCode: this.invoiceData.clientZipCode,
	        clientCountry: this.invoiceData.clientCountry,
	        invoiceDate: this.invoiceDate,
	        invoiceDateUnix: this.invoiceDateUnix,
	        paymentTerms: this.invoiceData.paymentTerms,
	        paymentDueDate: this.invoiceData.paymentDueDate,
	        paymentDueDateUnix: this.invoiceData.paymentDueDateUnix,
	        productDescription: this.invoiceData.productDescription,
	        invoiceTotal: this.invoiceData.invoiceTotal,

	        invoiceItemList: this.invoiceData.invoiceItemList,
				}).then((e) => {
					this.deleteInvoice(this.invoiceToEdit.uid)
					this.pushNewInvoice(e.data)
					this.setCurrentInvoice(e.data.uid)
					this.toggleEditInvoice()

					this.loading = false;
					this.toggleInvoice()
				})
				
			}
			catch (e) {
				if(e.response.status === 422){
					this.loading = false;
					this.errors = e.response.data.errors
				}

			}
		},



		submitForm () {
			if(this.editInvoice){
				this.updateInvoice()
				return;
			}
			this.uploadInvoice();
		},


	},


	computed: {
		...mapGetters({
			editInvoice: 'getEdittable',
			invoiceToEdit: 'getCurrentInvoice'
		})
	},


	watch: {
		paymentTerms: {
			handler(){
				const futureDate = new Date();
				this.invoiceData.paymentDueDateUnix = futureDate.setDate(futureDate.getDate() + parseInt(this.paymentTerms))
				this.invoiceData.paymentDueDate = new Date(this.invoiceData.paymentDueDateUnix).toLocaleDateString('en-us', this.dateOptions)
			},
			
		}
		
	},


	created() {

		if(!this.editInvoice){
			this.invoiceDateUnix = Date.now();
			this.invoiceDate = new Date(this.invoiceDateUnix).toLocaleDateString('en-us', this.dateOptions)
		}


		if(this.editInvoice){
			console.log(this.invoiceToEdit)

			this.invoiceData.billerStreetAddress = this.invoiceToEdit.biller_data.street_address
			this.invoiceData.billerCity = this.invoiceToEdit.biller_data.city
			this.invoiceData.billerZipCode = this.invoiceToEdit.biller_data.zip_code
			this.invoiceData.billerCountry = this.invoiceToEdit.biller_data.country

			this.invoiceData.clientName = this.invoiceToEdit.client_data.name
			this.invoiceData.clientEmail = this.invoiceToEdit.client_data.email
			this.invoiceData.clientStreetAddress = this.invoiceToEdit.client_data.street_address
			this.invoiceData.clientCity = this.invoiceToEdit.client_data.city
			this.invoiceData.clientZipCode = this.invoiceToEdit.client_data.zip_code
			this.invoiceData.clientCountry = this.invoiceToEdit.client_data.country

			this.invoiceDate = this.invoiceToEdit.invoice_date
			this.invoiceData.paymentDueDate = this.invoiceToEdit.invoice_payment_due

			this.invoiceData.productDescription = this.invoiceToEdit.description


			this.invoiceData.invoiceItemList = this.invoiceToEdit.items
		}
		

	},


}

</script>

<style lang="scss" scoped>
.invoice-wrap {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  overflow: scroll;
  &::-webkit-scrollbar {
    display: none;
  }
  @media (min-width: 900px) {
    left: 90px;
  }
  .invoice-content {
    position: relative;
    padding: 56px;
    max-width: 700px;
    width: 100%;
    background-color: #141625;
    color: #fff;
    box-shadow: 10px 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    h1 {
      margin-bottom: 48px;
      color: #fff;
    }
    h3 {
      margin-bottom: 16px;
      font-size: 18px;
      color: #777f98;
    }
    h4 {
      color: #7c5dfa;
      font-size: 12px;
      margin-bottom: 24px;
    }
    // Bill To / Bill From
    .bill-to,
    .bill-from {
      margin-bottom: 48px;
      .location-details {
        gap: 16px;
        div {
          flex: 1;
        }
      }
    }
    // Invoice Work
    .invoice-work {
      .payment {
        gap: 24px;
        div {
          flex: 1;
        }
      }
      .work-items {
        .item-list {
          width: 100%;
          // Item Table Styling
          .table-heading,
          .table-items {
            gap: 16px;
            font-size: 12px;
            .item-name {
              flex-basis: 50%;
            }
            .qty {
              flex-basis: 10%;
            }
            .price {
              flex-basis: 20%;
            }
            .total {
              flex-basis: 20%;
              align-self: center;
            }
            .item-delete-btn{
            	cursor: pointer;
            }
          }
          .table-heading {
            margin-bottom: 16px;
            th {
              text-align: left;
            }
          }
          .table-items {
            position: relative;
            margin-bottom: 24px;
            img {
              position: absolute;
              top: 15px;
              right: 0;
              width: 12px;
              height: 16px;
            }
          }
        }
        .button {
          color: #fff;
          background-color: #252945;
          align-items: center;
          justify-content: center;
          width: 100%;
          img {
            margin-right: 4px;
          }
        }
      }
    }
    .save {
      margin-top: 60px;
      div {
        flex: 1;
      }
      .right {
        justify-content: flex-end;
      }
    }
  }
  .input {
    margin-bottom: 24px;
  }
  label {
    font-size: 12px;
    margin-bottom: 6px;
  }
  input,
  select {
    width: 100%;
    background-color: #1e2139;
    color: #fff;
    border-radius: 4px;
    padding: 12px 4px;
    border: none;
    &:focus {
      outline: none;
    }
  }
}
</style>