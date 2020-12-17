<template>
	<div>
		<template>
			<client-only>
				<carousel :perPage="5" :loop="true" :paginationEnabled="false" :mouse-drag="false" :autoplay="false" easing="ease" :autoWidth="true" :autoHeight="true" :center="true" :navigationEnabled="true" navigationNextLabel="&rsaquo;" navigationPrevLabel="&lsaquo;">
					<slide v-for="(course, key) in mostPopular" :key="key" class="py-4">
						<router-link :to="{ name: 'course.show', params: { slug: course.slug } }">
							<div class="card border shadow-sm shadow--hover rounded">
								<img :src="course.image" class="card-img-top border-bottom" alt="">
								<div class="card-body py-3">
									<div class="grid-course-name">
										<h6 class="text-capitalize">
											<strong>{{course.title}}</strong>
										</h6>
									</div>
									<!-- <p class="mt-1 mb-1 small text-muted">{{course.user.name}}</p> -->
									<div class="rating-stars">
										<span class="rating-star-container">
											<star-rating :star-size="15" :inline="true" :read-only="true" :show-rating="false" :increment="0.5" :rating="course.rating_average"></star-rating>
										</span>
										<span class="rating-review-numbers">
											<span class="rating-review-stats">{{ courseAverage(course) }}</span>
											<span class="text-muted ml-1">({{ course.ratings_count }})</span>
										</span>
									</div>
									<div class="price float-right">
										<template v-if="course.free_course != 1">
											<h6 class="mt-3" v-if="course.has_discount == 1"><small class="text-muted"><strike>₱{{course.price}}</strike> </small>&nbsp; <b>₱{{course.discount}}</b> </h6>
											<h6 class="mt-3" v-else>
												<client-only>
													₱<b>{{course.price | numeral('0,0')}}</b>
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
					</slide>
				</carousel>
			</client-only>
		</template>
	</div>
</template>

<script>
	import axios from 'axios'
	import StarRating from 'vue-star-rating'

	export default {

		components: {
			StarRating
		},

		name: 'MostPopular',

		props: ['mostPopular'],

		methods: {
			courseAverage: function (course) {
				return parseFloat(course.rating_average).toFixed(1)
			}
		}

	}

</script>

<style scoped>
	.VueCarousel-slide {
		padding-left: 0px !important;
		padding-right: 10px !important;
	}
</style>
