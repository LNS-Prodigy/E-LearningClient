<template>
    <div>
        <!-- jumbotron -->
		<div class="jumbotron bg-gradient-danger mb-0 rounded-0">
			<section class="section-sm">
				<div class="container">
					<!-- // Slogan -->
					<div class="row justify-content-center">
                        <div class="col-lg-7 text-center">
                            <h1 class="display-3 text-white">How can we help?</h1>
                            <div class="form-group mt-4">
								<form class="my-auto d-inline w-25" @submit.prevent="submit">
									<div class="input-group input-group-alternative">
										<input aria-describedby="addon-right addon-left" type="text" v-model="search" name="search" placeholder="Search for solutions" class="form-inline form-control">
										<div class="input-group-prepend">
											<span class="input-group-text rounded-right">
												<fa icon="search" fixed-width class="text-danger" />
											</span>
										</div>
									</div>
								</form>
							</div>
                        </div>
                    </div>
				</div>
			</section>
		</div>

        <!-- // FQA -->
		<section class="section">
			<div class="container">
				<h3>Frequently Asked Questions</h3>
				<div class="row mt-4">
					<div class="col-lg-12">
						<div class="row">
							<div class="col-lg-4 mb-3" v-for="(item, key) in faqs" :key="key">
								<router-link :to="{ name: 'help-center.student.category.post', params: { categorySlug: item.category_id, postSlug: item.slug } }">
									<card class="p-1 pb-4 shadow-sm shadow--hover">
										<h6 class="mb-0">{{item.title}}</h6>
									</card>
								</router-link>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>

		<!-- // SELECT TOPIC -->
		<section class="section-sm">
			<div class="container">
				<h3>Select topic to search for help</h3>
				<div class="row mt-4">
					<div class="col-lg-4 mb-3" v-for="category in categories" :key="category.id">
						<div class="wrap">
							<router-link :to="{ name: 'help-center.student.category', params: { slug: category.slug } }">
								<card class="shadow-sm shadow--hover wrap align-items-center">
									<div class="mt-3">
										<svg width="63" height="63"
											xmlns="http://www.w3.org/2000/svg">
											<image :xlink:href="category.icon" height="63" width="63"/>
										</svg>
										<h5 class="mt-3">{{category.name}}</h5>
										<h6 class="mb-0 text-muted">{{category.description}}</h6>
									</div>
								</card>
							</router-link>
						</div>
					</div>
				</div>
			</div>
		</section>

    </div>
</template>

<script>
    import axios from 'axios'

    export default {

		scrollToTop: true,

        head() {
            return { title: 'Help Center'}
        },

        data: () => ({
            search: ''
        }),

        async asyncData() {
            try {
                let { data } = await axios.get('/help-center')
                return {
					categories: data.categories,
					faqs: data.faqs
                }
            } catch (e) {
                return
            }
        },

        methods: {
            submit() {
                this.$router.push('/help-center/student/search?q=' + this.search)
            }
        }

    }

</script>

<style scoped>
	@media (min-width: 1200px) { 
		.container {
			max-width: 1040px !important;
		}
	}

	.wrap {
		border-radius: 2px;
		text-align: center;
		min-height: 205px;
		cursor: pointer;
		-webkit-transition: all 0.25s ease;
		-moz-transition: all 0.25s ease;
		-o-transition: all 0.25s ease;
		transition: all 0.25s ease;
	}
	.icon-2 {
		height: 4rem;
		width: 4em;
	}
</style>