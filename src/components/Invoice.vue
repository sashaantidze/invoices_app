<template>
    <div class="">
        <router-link :to="{name: 'InvoiceView', params: {invoiceId: invoice.uid}}" class="invoice flex">
            <div class="left flex">
                <span class="tracking-number">#{{invoice.uid}}</span>
                <span class="due-date">{{invoice.invoice_payment_due}}</span>
                <span class="person">{{invoice.client_data.client_name}}</span>
            </div>

            <div class="right flex">
                <span class="price">{{formattedTotal}}</span>
                <div class="status-button flex"
                    :class="{
                        paid: invoice.invoice_paid,
                        draft: invoice.invoice_draft,
                        pending: !invoice.invoice_paid && !invoice.invoice_draft}">

                    <span v-if="invoice.invoice_paid">Paid</span>
                    <span v-if="invoice.invoice_draft">Draft</span>
                    <span v-if="!invoice.invoice_paid && !invoice.invoice_draft">Pending</span>
                    
                </div>

                <div class="icon">
                    <img src="@/assets/icon-arrow-right.svg" alt="">
                </div> 

            </div>
        </router-link>
        <br>
    </div>
</template>

<script>

export default {
    name: "Invoice",

    props: {
        invoice: {
            required: true,
            type: Object
        }
    },


    computed: {
        formattedTotal(){
            return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'GEL' }).format(this.invoice.itemsTotal) 
        }
    }
}
</script>

<style lang="scss" scoped>
.invoice {
  text-decoration: none;
  cursor: pointer;
  gap: 16px;
  margin-bottom: 16px;
  color: #fff;
  border-radius: 20px;
  padding: 28px 32px;
  background-color: #1e2139;
  align-items: center;
  span {
    font-size: 13px;
  }
  .left {
    align-items: center;
    flex-basis: 60%;
    gap: 16px;
    span {
      flex: 1;
    }
    .tracking-number {
      text-transform: uppercase;
    }
  }
  .right {
    gap: 16px;
    flex-basis: 40%;
    align-items: center;
    .price {
      flex: 1;
      font-size: 16px;
      font-weight: 600px;
    }
  }
}
</style>
