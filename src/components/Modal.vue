<template>
    <div class="modal flex">
        <div class="modal-content">
        	<p>Are you sure you want to exit? Changes will not be saved.</p>

        	<div class="actions flex">
        		<button @click="closeModal" class="purple">Keep it</button>
        		<button @click="closeInvoce" class="red">CLose</button>
        	</div>
        </div>
    </div>
</template>

<script>

import {mapMutations, mapGetters} from 'vuex'

export default {
	
	methods:{

		...mapMutations({
			toggleInvoice: 'TOGGLE_INVOICE',
			toggleModal: 'TOGGLE_MODAL',
      toggleEditInvoice: 'TOGGLE_EDIT_INVOICE',
		}),

		closeInvoce(){
			this.toggleInvoice();
			this.toggleModal();

      if(this.editInvoice){
        this.toggleEditInvoice()
      }
		},


		closeModal() {
			this.toggleModal();
		}

	},


  computed: {
    ...mapGetters({
      editInvoice: 'getEdittable'
    })
  }
}
</script>


<style lang="scss" scoped>
.modal {
  z-index: 100;
  position: fixed;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100%;
  .modal-content {
    border-radius: 20px;
    padding: 48px 32px;
    max-width: 450px;
    background-color: #252945;
    color: #fff;
    p {
      text-align: center;
    }
    .actions {
      margin-top: 24px;
      button {
        flex: 1;
      }
    }
  }
}
</style>