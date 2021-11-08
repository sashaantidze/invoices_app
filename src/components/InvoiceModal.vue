<template>
	
	<div @click="checkClick" ref="invoiceWrap" class="invoice-wrap flex flex-column">
		<form @submit.prevent="submitForm" class="invoice-content">
			<h1>New Invoice</h1>

			<div class="bill-from flex flex-column">
				<h4>Bill From</h4>
				<div class="input flex flex-column">
					<label for="billerStreetAddress">Street Address</label>
					<input required type="text" id="billerStreetAddress" v-model="">
				</div>

				<div class="location-details flex">
					<div class="input flex flex-column">
						<label for="billerCity">City</label>
						<input required type="text" id="billerCity" v-model="billerCity">
					</div>

					<div class="input flex flex-column">
						<label for="billerZipCode">Zip Code</label>
						<input required type="text" id="billerZipCode" v-model="billerZipCode">
					</div>

					<div class="input flex flex-column">
						<label for="billerCountry">Country</label>
						<input required type="text" id="billerCountry" v-model="billerCountry">
					</div>
				</div>
			</div>

			<div class="bill-to flex flex-column">
				
			</div>

		</form>
	</div>

</template>

<script>
	
export default {
name: "InvoiceModal",

data () {
	return {
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
		invoiceDateUnix: null,
		invoiceDate: null,
		paymentTerms: null,
		paymentDueDateUnix: null,
		paymentDueDate: null,
		productDescription: null,
		invoicePending: null,
		invoiceDraft: null,
		invoiceItemList: [],
		invoiceTotal: 0,
	}
}
}

</script>