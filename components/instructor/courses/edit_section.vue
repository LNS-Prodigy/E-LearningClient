<template>
	<transition name="fade" mode="out-in">
		<modal :form_action="editSection" @keydown="form.onKeydown($event)" header="Add New Section">
            <template slot="header">
                <h5 class="modal-title">Edit Section</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close" @click="$emit('close')">
                    <span aria-hidden="true">&times;</span>
                </button>
            </template>
            <template slot="form">
                <div class="modal-body">
                    <div class="form-group">
                        <label for="title" class="col-form-label">Title</label>
                        <input type="text" name="title" :class="{ 'is-invalid' : form.errors.has('title') }" v-model="form.title" class="form-control rounded">
                        <h6 class="text-muted"><small>Provide a Section Name</small></h6>
                        <has-error :form="form" field="title" />
                    </div>
                </div>
                <div class="modal-footer">
                    <v-button :loading="form.busy" class="btn btn-primary rounded btn-sm">Save changes</v-button>
                </div>
            </template>
        </modal>
	</transition>
</template>

<script>
	import axios from 'axios'
	import Form from 'vform' 

	export default {
		name: 'EditSectionmodal',

		props: ['data', 'index'],

		data: function () {
			return {
				section: [],

				form: new Form({
					course_id: '',
					title: ''
				}),
			}
		},

		created() {
			this.getSection();
		},

		methods: {
			async getSection() {
				await axios.get(`/instructor/courses/section/edit_section/${this.data.id}/get`)
				.then((res) => {
					this.section = res.data.section
					this.form.fill(this.section)
				}).catch((err) => {
					console.log(err)
				})
			},

			async editSection() {
				try {
					let { data } = await this.form.patch(`/instructor/courses/section/edit_section/${this.data.id}/patch`)

					this.$swal({
						toast: true,
						position: 'bottom-end',
						timer: 3000,
						showConfirmButton: false,
						type: 'success',
						text: data.message
					})

					var newSectionData = {
						index: this.index,
						id: data.section.id,
						title: data.section.title
					}

					this.$emit('close')
					this.$emit('clicked', newSectionData)
				} catch (error) {
					return
				}
			}

		}
	}
</script>

<style>

</style>