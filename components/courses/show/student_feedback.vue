<template>
	<div>
		<!-- // Feedback -->
		<div class="row">
			<div class="col-lg-3">
				<div class="text-center mb-5 mt-2">
					<h1 class="display-1">{{ average }}</h1>
					<div class="ratings">
						<star-rating :star-size="20" :inline="true" inactive-color="#fff" :read-only="true" :show-rating="false" :rating="average" :increment="0.5" :border-width="3" :rounded-corners="true" :star-points="[23,2, 14,17, 0,19, 10,34, 7,50, 23,43, 38,50, 36,34, 46,19, 31,17]"></star-rating>
					</div>
					<div class="mt-2">
						Course Rating
					</div>
				</div>
			</div>
			<div class="col-lg-9">
				<div class="individual-rating">
			        <ul class="list-unstyled">
			        	<!-- // 1 Star -->
						<li>
				            <div class="progress">
				            	<div class="progress-bar" :style="`width: ${totalOnePercentage}%`"></div>
				            </div>
				            <div>
				            	<span class="rating">
				                	<i class="fas fa-star"></i>
				                    <i class="fas fa-star"></i>
				                    <i class="fas fa-star"></i>
				                    <i class="fas fa-star"></i>
				                    <i class="fas fa-star filled"></i>
				                </span>
				                <span>{{totalOnePercentage}}%</span>
				            </div>
			            </li>
						<!-- // 2 Stars -->
			            <li>
				            <div class="progress">
				            	<div class="progress-bar" :style="`width: ${totalTwoPercentage}%`"></div>
				            </div>
				            <div>
				            	<span class="rating">
				                	<i class="fas fa-star"></i>
				                    <i class="fas fa-star"></i>
				                    <i class="fas fa-star"></i>
				                    <i class="fas fa-star filled"></i>
				                    <i class="fas fa-star filled"></i>
				                </span>
				                <span>{{totalTwoPercentage}}%</span>
				            </div>
			            </li>
			            <!-- // 3 Stars -->
			            <li>
				            <div class="progress">
				            	<div class="progress-bar" :style="`width: ${totalThreePercentage}%`"></div>
				            </div>
				            <div>
				            	<span class="rating">
				                	<i class="fas fa-star"></i>
				                    <i class="fas fa-star"></i>
				                    <i class="fas fa-star filled"></i>
				                    <i class="fas fa-star filled"></i>
				                    <i class="fas fa-star filled"></i>
				                </span>
				                <span>{{totalThreePercentage}}%</span>
				            </div>
			            </li>
			            <!-- // 4 Stars -->
			            <li>
				            <div class="progress">
				            	<div class="progress-bar" :style="`width: ${totalFourPercentage}%`"></div>
				            </div>
				            <div>
				            	<span class="rating">
				                	<i class="fas fa-star"></i>
				                    <i class="fas fa-star filled"></i>
				                    <i class="fas fa-star filled"></i>
				                    <i class="fas fa-star filled"></i>
				                    <i class="fas fa-star filled"></i>
				                </span>
				                <span>{{totalFourPercentage}}%</span>
				            </div>
			            </li>
			            <!-- // 5 Stars -->
			            <li>
				            <div class="progress">
				            	<div class="progress-bar" :style="`width: ${totalFivePercentage}%`"></div>
				            </div>
				            <div>
				            	<span class="rating">
				                	<i class="fas fa-star filled"></i>
				                    <i class="fas fa-star filled"></i>
				                    <i class="fas fa-star filled"></i>
				                    <i class="fas fa-star filled"></i>
				                    <i class="fas fa-star filled"></i>
				                </span>
				                <span>{{totalFivePercentage}}%</span>
				            </div>
			            </li>
			    	</ul>
			    </div>
			</div>
		</div>
		<!-- // Reviews -->
		<div class="mt-3" v-if="ratings.length != null">
			<h5 class="font-weight-600">Reviews</h5>
			<hr class="mt-3 mb-0">
			<div v-for="(rating, index) in ratings" :key="index">
				<div v-if="rating.comments != null" class="reviews">
					<div class="row">
						<!-- // User -->
						<div class="col-lg-4">
							<div class="d-inline-flex">
								<div>
									<img v-if="rating.user.avatar == 'users/default.png'" :src="rating.user.photo_url" class="rounded-circle mr-1" height="46" width="46" alt="">
									<client-only v-else>
										<cld-image :publicId="`${rating.user.avatar_public_id}.png`" class="mr-1 profile-photo" alt="">
											<cld-transformation height="46" width="46" crop="fill" radius="100" />
										</cld-image>
									</client-only>
								</div>
								<div>
									<div class="ml-3">
										<span class="small text-muted">{{ rating.created_at | moment("from", "now") }}</span>
										<div>
											<p class="mb-0 font-weight-500">{{ rating.user.name }}</p>
										</div>
									</div>
								</div>
							</div>
						</div>
						<!-- // Comment -->
						<div class="col-lg-8">
							<div>
								<star-rating :star-size="15" inactive-color="#fff" :read-only="true" :show-rating="false" :rating="rating.rating" :increment="0.5" :border-width="3" :rounded-corners="true" :star-points="[23,2, 14,17, 0,19, 10,34, 7,50, 23,43, 38,50, 36,34, 46,19, 31,17]"></star-rating>
							</div>
							<div class="mt-3">
								{{ rating.comments }}
							</div>
						</div>
					</div>
				</div>
				
			</div>
		</div>
	</div>
</template>

<script>
	import StarRating from 'vue-star-rating'

	export default {

		name: 'StudentFeedback',

		components: {
			StarRating
		},

		props: ['ratings_count', 'average', 'ratings', 'five', 'four', 'three', 'two', 'one'],

		computed: {
			totalFivePercentage: function () {
				return parseInt((this.five / this.ratings_count) * 100)  
			},

			totalFourPercentage: function () {
				return parseInt((this.four / this.ratings_count) * 100)
			},

			totalThreePercentage: function () {
				return parseInt((this.three / this.ratings_count) * 100)
			},

			totalTwoPercentage: function () {
				return parseInt((this.two / this.ratings_count) * 100)
			},

			totalOnePercentage: function () {
				return parseInt((this.one / this.ratings_count) * 100)
			}
		}
	
	}

</script>

<style lang="scss" scoped>
	.reviews {
		margin-bottom: 27px;
    	padding-top: 24px;
		border-top: 1px solid #dedfe0;
	}
	.reviews:last-child {
	    padding-bottom: 27px;
	}
	.reviews:last-child {
	    border-bottom: 1px solid #dedfe0;
	    margin-bottom: 0;
	}
	.individual-rating ul {
	    margin: 0;
	    padding: 0;
	    list-style: none;
	}
	.individual-rating ul li {
	    display: -webkit-box;
	    display: -ms-flexbox;
	    display: flex;
	    -webkit-box-align: center;
	    -ms-flex-align: center;
	    align-items: center;
	}
	.individual-rating ul li .progress {
	    width: 70%;
	    height: 20px;
	    border-radius: 3px;
	    background-color: #f2f3f5;
	}
	.individual-rating ul li .progress-bar {
	    border-radius: 3px;
	    background-color: #a1a7b3;
	}
	.progress-bar {
	    display: -webkit-box;
	    display: -ms-flexbox;
	    display: flex;
	    -webkit-box-orient: vertical;
	    -webkit-box-direction: normal;
	    -ms-flex-direction: column;
	    flex-direction: column;
	    -webkit-box-pack: center;
	    -ms-flex-pack: center;
	    justify-content: center;
	    color: #fff;
	    text-align: center;
	    background-color: #007bff;
	    transition: width .6s ease;
	}
	.individual-rating li > div:not(.progress) {
	    padding-left: 15px;
	    margin-top: -18px;
	}
	.student-feedback-box .individual-rating li > div:not(.progress) span:not(.rating) {
	    text-align: center;
	    padding-left: 10px;
	    color: #007791;
	}
	.individual-rating .rating i {
	    font-size: 14px;
	    color: #dedfe0;
	}
	.student-feedback-box .individual-rating .rating i.filled {
	    color: #f4c150;
	}
	.individual-rating .rating i {
	    font-size: 14px;
	    color: #dedfe0;
	}
	.rating i.filled {
	    color: #f4c150;
	}

	.rating i {
	    color: #dedfe0;
	}

	.progress {
	    display: -webkit-box;
	    display: -ms-flexbox;
	    display: flex;
	    height: 1rem;
	    overflow: hidden;
	    font-size: .75rem;
	    background-color: #e9ecef;
	    border-radius: .25rem;
	}
</style>