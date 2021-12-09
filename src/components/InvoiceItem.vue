<template>

        <p>{{ item.name }}</p>
        <p>{{ item.qty }}</p>
        <p>{{ item.price }}</p>
        <p>{{ item.total }}</p>

</template>

<script>

export default {
    props: {
    	item: {
    		type: Object,
    		required: true
    	}
    }
}
</script>
