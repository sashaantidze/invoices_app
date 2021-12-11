<template>
	<div class="home container">
		
		<div class="header flex">
			<div class="left flex flex-column">
				<h1>Invoices</h1>
				<span>There are 4 total invoices</span>
			</div>

			<div class="right flex">
				<div @click="toggleFilterMenu" class="filter flex">
					<span>Filter by status: <span v-if="filteredBy">{{filteredBy}}</span></span>
					<img src="@/assets/icon-arrow-down.svg" alt="">
					<ul v-show="filterMenu" class="filter-menu">
						<li @click="filterInvoices">Draft</li>
						<li @click="filterInvoices">Pending</li>
						<li @click="filterInvoices">Paid</li>
						<li @click="filterInvoices">Clear Filter</li>
					</ul>
				</div>
				<div @click="newInvoice" class="button flex">
					<div class="inner-button flex">
						<img src="@/assets/icon-plus.svg" alt="">
					</div>
					<span>New Invoice</span>
				</div>
			</div>
		</div>

		<!-- INVOICES -->

		<div v-if="Invoices.length">
			<Invoice v-for="(invoice, index) in Invoices" :invoice="invoice" :key="index" />
		</div>
		<div v-else class="empty flex flex-column">
			<img src="@/assets/illustration-empty.svg" alt="">
			<h3>There is nothing here</h3>
			<p>Get started by clicking New Invoice button and your invoices will appear on this page.</p>
		</div>


	</div>
</template>

<script>
import {mapMutations, mapGetters} from 'vuex'
import Invoice from '../components/Invoice'
export default {
	name: 'home',

	components: {
		Invoice
	},

	data() {
		return {
			Invoices: [],

			filterMenu:null,
			filteredBy:null,
		}
	},


	methods: {

		...mapMutations({
			toggleInvoice: 'TOGGLE_INVOICE',
			filterByPending: 'FILTER_INVOICES_BY_PENDING',
			clearFilter: 'CLEAR_INVOICE_FILTER',
			filterByPaid: 'FILTER_INVOICES_BY_PAID',
			filterByDraft: 'FILTER_INVOICES_BY_DRAFT',
		}),

		newInvoice () {
			this.toggleInvoice();
		},

		toggleFilterMenu() {
			this.filterMenu = !this.filterMenu;
		},

		setFilteredInvoices(){
			this.Invoices = this.filteredInvoices
		},


		filterInvoices(e){
			this.filteredBy = e.target.innerHTML
			switch(this.filteredBy){
				case 'Pending':
					this.filterByPending()
					this.setFilteredInvoices()
					break

				case 'Paid':
					this.filterByPaid()
					this.setFilteredInvoices()
					break

				case 'Draft':
					this.filterByDraft()
					this.setFilteredInvoices()
					break

				default :
					this.Invoices = this.InvoiceData
					this.filteredBy = null
			}
			
		}
	},


	computed: {
		...mapGetters({
			InvoiceData: 'getInvoiceData',
			filteredInvoices: 'getFilteredInvoices'
		}),
	},


	created(){
		this.Invoices = this.InvoiceData
	}

}

</script>

<style lang="scss" scoped>
	
.home {
	color: #fff;

	.header{
		margin-bottom: 65px;

		.left,
		.right {
			flex: 1
		}


		.right {
			justify-content: flex-end;
			align-items: center;

			.button,
			.filter{
				align-items:center;

				span{
					font-size: 12px;
				}
			}


			.filter{
				position: relative;
				margin-right: 40px;
				cursor: pointer;

				img{
					margin-left: 12px;
					width: 9px;
					height: 5px;
				}


				.filter-menu{
					width: 120px;
					position: absolute;
					top: 25px;
					list-style: none;
					background-color: #24263c;
					box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);

					li {
						cursor: pointer;
			            font-size: 12px;
			            padding: 10px 20px;

			            &:hover {
			              color: #1e2139;
			              background-color: #fff;
			            }
					}




				}


			}


			.button {
				padding: 8px 10px;
		        background-color: #7c5dfa;
		        border-radius: 40px;

		        span {
		        	background-color: #7c5dfa;
      				color: #fff;
      			}

		        .inner-button {
		          margin-right: 8px;
		          border-radius: 50%;
		          padding: 8px;
		          align-items: center;
		          justify-content: center;
		          background-color: #fff;

		          	img {
			            width: 10px;
			            height: 10px;
			            background:#fff;
          			}

        		}
			}

		}
	}


	.empty{
		margin-top: 160px;
		align-items: center;

		img{
			width: 214px;
			heigh: 200px;
		}

		h3{
			font-size: 20px;
			margin-top: 40px;
		}

		p{
			text-align: center;
			max-width: 224px;
			font-size: 300;
			margin-top: 16px;
			font-size: 12px;
		}
	}
}

</style>