<template>
    <div style="color: #fff;" class="">
        {{currentInvoice}}
    </div>
</template>

<script>
import {mapMutations, mapGetters, mapState} from 'vuex'
export default {
	name: "InvoiceView",

	data() {
		return {
			invoice: null
		}
	},

	methods: {
		...mapMutations({
			setCurrentInvoice: 'SET_CURRENT_INVOICE',
		}),

		getInvoice(){
			this.setCurrentInvoice(this.$route.params.invoiceId);
		}
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
