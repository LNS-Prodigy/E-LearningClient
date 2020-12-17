<template>
	<div>
		<div class="jumbotron bg-gradient-default mb-0 rounded-0 pb-0 pt-lg-5">
			<section>
				<div class="container">
					<div>
						<h2 class="text-white">My Courses</h2>
						<ul class="list-unstyled pt-3">
							<li class="d-inline-block mr-4" v-for="tab in tabs" :key="tab.id">
								<router-link :to="{ name: tab.route }" class="page-header text-white">
									{{tab.name}}
								</router-link>
							</li>
						</ul>
					</div>
				</div>
			</section>
		</div>

		<!-- // Main Body -->
		<section class="section-sm">
			<div class="container">

				<div class="filters row">
					<div class="col-lg-4">
						<h6 class="text-muted"><small>Search</small></h6>
						<form class="my-auto d-inline" @submit.prevent="goSearch">
							<div class="input-group">
								<input aria-describedby="addon-right addon-left w-25" type="text" name="search" placeholder="Search for courses" class="form-inline form-control" v-model="form.q">
								<div class="input-group-prepend">
									<span class="input-group-text btn btn-outline-primary rounded-right">
										<fa icon="search" fixed-width />
									</span>
								</div>
							</div>
						</form>
					</div>
				</div>

				<div class="mt-4">

				</div>

			</div>
		</section>
	</div>
</template>

<script>
	let myBody = null

	import axios from 'axios'
	import { mapGetters } from 'vuex'

	import RatingModal from '~/components/courses/enrolled/rating'
	import EditRatingModal from '~/components/courses/enrolled/edit_rating'

	import StarRating from 'vue-star-rating'

	import Form from 'vform'

	export default {

		middleware: 'auth',

		components: {
			RatingModal, EditRatingModal, StarRating
		},

		head() {
			return { title: 'My Courses' }
		},

		data: function () {
			return {
				showRatingModal: false,
				showEditRatingModal: false,

				searchResults: [],
				search: '',

				form: new Form({
					q: ''
				})
			}
		},

		async asyncData({ query, error }) {
			try {
				let { data } = await axios.get(`/student/account/my-courses/learning/search?q=${query.q}`)
				return {
					searchQuery: query.q
				}
			} catch (e) {
				error({ statusCode: 500, message: 'Something went wrong!' })
			}
		},

		computed: {
			...mapGetters({
				user: 'auth/user'
			}),

			tabs() {
				return [
					{
						name: 'My Courses',
						route: 'student.courses'
					}
				]
			}
		},

		mounted: function () {
			myBody = document.getElementsByTagName('body')[0]
		},

		created: function () {
			this.getSearchResults()
		},

		watch: {
			'$route': 'getSearchResults'
		},

		computed: {
			groups: function () {
				return groupBy(this.searchResults, 'groupName')
			}
		},

		methods: {

			getSearchResults: function (page = 1) {
				this.isLoading = !this.loading

				axios.get(`/student/account/my-courses/learning/search?q=${this.$route.query.q}`)

				.then((res) => {
					this.isLoading = !this.isLoading
					this.searchResults = res.data.searchResults
				}).catch((err) => {
					this.isLoading = !this.isLoading
				})
			},

			async goSearch() {
				let { data } = await this.form.post(`/student/account/my-courses/learning/search`)
				this.$router.push('/search?q=' + this.form.q)
			},

			openRatingModal: function (data, index) {
				this.courseData = data
				this.courseIndex = index
				this.showRatingModal = true

				myBody.classList.toggle('modal-open')
			},

			closeRatingModal: function () {
				this.showRatingModal = false
				myBody.classList.remove('modal-open')
			},

			saveNewRating: function (value) {
				this.$set(this.searchResults[value.index])
			},

			openEditRatingModal: function (data, index) {
				this.courseData = data
				this.courseIndex = index
				this.showEditRatingModal = true

				myBody.classList.toggle('modal-open')
			},

			closeEditRatingModal: function () {
				this.showEditRatingModal = false
				myBody.classList.remove('modal-open')
			},

			saveUpdateRating: function (value) {
				this.$set(this.searchResults[value.index], 'rating', value)
			},

			totalPercentage: function (course) {
				return parseInt((course.progress_count / course.lessons_count) * 100)
			}

		},

		beforeRouteEnter (to, from, next) {
			next(vm => {
				vm.getSearchResults()
				next()
			})
		}

	}

	function groupBy(array, key) {
		const result = {}
		array.forEach(item => {
			if (!result[item[key]]) {
				result[item[key]] = []
			}
			result[item[key]].push(item)
		})
		return result
	}

</script>

<style lang="scss" scoped>

</style>
