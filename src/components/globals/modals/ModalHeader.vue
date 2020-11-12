<template>
  <q-card-section class="row">
	   <div class="row q-mb-md">
        <q-banner class="bg-grey-3 col">
          <template v-slot:avatar>
            <q-icon name="account_circle" color="primary" />
          </template>
          <slot></slot>
		  
        </q-banner>
      </div>

    <q-space />
    <q-btn v-close-popup flat round dense icon="close" />
  </q-card-section>
</template>

<script>
export default {};
</script>