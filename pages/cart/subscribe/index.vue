<template>
	<div>
		
		<section class="section-sm">
			<div class="container">
				
				<div class="alert alert-danger rounded">
					<p class="mb-0 font-weight-bold"><fa  icon="check-circle" fixed-width /> Great choice, {{ user.name }}</p>
				</div>

				<div class="mt-5">
					<h5 class="font-weight-bold">Jump right in!</h5>
					<div class="slider">
						<div class="py-3">
							<card class="rounded shadow--hover border">
								<!-- // Rows -->
								<div class="row">
									<div class="col-lg-5">
										<client-only>
											<cld-image :publicId="`${featuredCourse.image_public_id}.png`" responsive="width" alt="">
												<cld-transformation height="236" width="420" crop="fill" />
												<cld-transformation border="1px_solid_rgb:00390b" />
											</cld-image>
										</client-only>
									</div>
									<div class="col-lg-7 pl-3">
										<!-- // Content -->
										<h5 class="font-weight-500 mb-0">{{featuredCourse.title}}</h5>

										<p class="mt-3" style="font-size: 15px !important;">
											By {{featuredCourse.user.name}}
										</p>
										
										<h6 class="mb-2 font-weight-600">Your Progress</h6>
										<div class="progress" style="height: 8px;">
											<div role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" class="progress-bar bg-danger" style="width: 0%;">
											</div>
										</div>

										<button type="button" class="btn btn-danger rounded text-capitalize">
											Start Course
										</button>
										
									</div>
								</div>
							</card>
						</div>
					</div>
				</div>

			</div>
		</section>

		<section class="section-sm bg-secondary">
			<div class="container">
				<h4>You Might Like</h4>
				<div class="mt-4">
					<div class="row">
						<div class="col-lg-3 col-sm-6 item-col-lg-3 mb-4" v-for="course in mightLikes" :key="course.id">
							<router-link :to="{ name: 'course.show', params: { slug: course.slug } }">
								<div class="card shadow-sm shadow--hover card-lift--hover rounded">
									<img :src="course.image" class="card-img-top border-bottom" alt="">
									<div class="card-body py-3">
										<div class="grid-course-name">
											<h6 class="text-capitalize">
												<strong>{{course.title}}</strong>
											</h6>
										</div>
										<p class="mt-1 mb-1 small text-muted">{{course.user.name}}</p>
										<div class="rating">
											<fa icon="star" fixed-width style="color: #f4c150" />
											<fa icon="star" fixed-width style="color: #f4c150" />
											<fa icon="star" fixed-width style="color: #f4c150" />
											<fa icon="star" fixed-width style="color: #f4c150" />
											<fa icon="star" fixed-width style="color: #f4c150" />
										</div>
										<div class="price float-right">
											<template v-if="course.free_course != 1">
												<h6 class="mt-3" v-if="course.has_discount == 1"><small class="text-muted"><strike>₱{{course.price}}</strike> </small>&nbsp; <b>₱{{course.discount}}</b> </h6>
												<h6 class="mt-3" v-else>
													<client-only>
														<b>₱{{ course.price | numeral('0,0') }}</b>
													</client-only>
												</h6>
											</template>
											<template v-else>													
												<h6 class="mt-3">Free Course</h6>
											</template>
										</div>
									</div>
								</div>
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
	import { mapGetters } from 'vuex'

	export default {

		middleware: 'auth',

		head() {
			return { title: 'Online Course' }
		},

		computed: mapGetters({
			user: 'auth/user'
		}),

		async asyncData({ params, error }) {
			try {
				let { data } = await axios.get(`/cart/subscribe/course/${params.id}/get`)
				return {
					enrolled_course: data.enrolled_course,
					featuredCourse: data.showCourse,
					mightLikes: data.mightLikes
				}	
			} catch (e) {
				error({ statusCode: 500, message: 'Error' })
			}
		}

	}
</script>

<style lang="scss" scoped>

</style>