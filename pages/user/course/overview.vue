<template>
	<div>
		<h4 class="font-weight-600">About this course</h4>
		<p>{{ course.excerpt }}</p>
		<hr class="my-3">
		<div class="row">
			<div class="col-lg-3">
				<p>By the numbers</p>
			</div>
			<div class="col-lg-4">
				<ul class="list-unstyled">
					<li>Skill Level: &nbsp; {{ course.level }}</li>
					<li>Students: &nbsp; {{ students }}</li>
					<li>Languages: &nbsp; {{ course.language }}</li>
				</ul>
			</div>
			<div class="col-lg-4">
				<ul class="list-unstyled">
					<li>Lectures: &nbsp; {{ lessonCount }}</li>
					<li>Video: &nbsp; {{ duration }}</li>
				</ul>
			</div>
		</div>
		<hr class="my-3">
		<div class="row">
			<div class="col-lg-3">
				Features
			</div>
			<div class="col-lg-9">
				Full Lifetime Access
			</div>
		</div>
		<hr class="my-3">
		<div class="row">
			<div class="col-lg-3">
				Description
			</div>
			<div class="col-lg-9">
				<client-only>
					<read-more more-str="read more" less-str="read less" :max-chars="1000" :text="course.description"></read-more>
				</client-only>
			</div>
		</div>
		<hr class="my-3">
		<div class="row">
			<div class="col-lg-3">
				Instructor				
			</div>
			<div class="col-lg-9">
				<div class="d-inline-flex">
					<div>
						<template v-if="course.user.avatar != 'users/default.png'" >
			                <client-only>
			                    <cld-image :publicId="`${course.user.avatar_public_id}.png`" alt="" >
			                        <cld-transformation height="64" width="64" crop="fill" radius="100" />
			                    </cld-image>
			                </client-only>
			            </template>
			            <img v-if="course.user.avatar == 'users/default.png'" :src="course.user.photo_url" class="rounded-circle img-fluid course__user-img" alt="">
					</div>
					<div class="ml-3 mt-3">
						<h6 class="font-weight-600 mb-0">{{ course.user.name }}</h6>
						<p class="text-muted">{{ course.user.introduction }}</p>
					</div>
				</div>

				<div class="mt-3">
                    <client-only>
                        <read-more v-if="course.user.biography" more-str="read more" less-str="read less" :max-chars="500" :text="course.user.biography"></read-more>
                    </client-only>
                </div>

			</div>
		</div>		
	</div>
</template>

<script>
	import axios from 'axios'

	export default {

		async asyncData({ params, error }) {
			try {
				let { data } = await axios.get(`/student/account/my-courses/learning/${params.slug}/show/overview`)
				return {
					course: data.courseDetails,
					students: data.students,
					duration: data.totalDuration,
					lessonCount: data.lessonCount
				}	
			} catch (e) {
				return
			}
		}
	
	}

</script>

<style lang="scss" scoped>

</style>