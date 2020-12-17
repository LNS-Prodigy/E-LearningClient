<template>
    <div>
        <template>
            <div v-if="courses.length != 0">
                <div v-for="(item, key) in courses.data" :key="key">
                    <div class="search_body pt-2 pb-3 pl-2 pr-3 border-bottom">
                        <router-link :to="{ name: 'course.show', params: { slug: item.slug } }">
                            <div class="row justify-content-between">
                                <div class="col-lg-auto">
                                    <img :src="item.image" class="search_image img-fluid" alt="">
                                </div>
                                <div class="col-lg-5">
                                    <h5 class="mb-2 font-weight-600">{{item.title}}</h5>
                                    <div class="rating-row">
                                        <span class="course-badge best-seller mr-2">{{item.level}}</span>
                                        <small class="mr-2">
                                            <span class="text-other">{{item.lessons_count}} Lectures &#9679;</span>
                                            <span class="text-other">{{ item.students_count }} Students enrolled &#9679;</span>
                                            <span class="text-other">All Levels</span>
                                        </small>
                                    </div>
                                    <p class="text-muted mt-2" style="font-size: 13px !important;">{{item.excerpt}} | By {{ item.user.name }}</p>
                                </div>
                                <div class="col-lg-4">
                                    <div class="float-right">
                                        <template v-if="!item.free_course">
                                            <div v-if="item.has_discount == 0">
                                                <h6 class="font-weight-bold text-right">₱{{item.price | numeral('0,0.00')}}</h6>
                                            </div>
                                            <div v-if="item.has_discount == 1">
                                                <h6 class="font-weight-bold text-right">₱{{item.discount | numeral('0,0.00')}}</h6>
                                                <h6 class="text-muted float-right"><strike>₱{{item.price | numeral('0,0.00')}}</strike></h6>
                                            </div>
                                        </template>
                                        <template v-else>
                                            <p class="mb-0 text-dark text-right">Free Course</p>
                                        </template>
                                        <div class="rating-stars mt-5 mb-0">
    										<span class="rating-star-container">
    											<star-rating :star-size="15" :inline="true" :read-only="true" :show-rating="false" :increment="0.5" :rating="item.rating_average"></star-rating>
    										</span>
    										<span class="rating-review-numbers">
    											<span class="rating-review-stats">{{ ratingAverage(item) }}</span>
    										</span>
    									</div>
                                        <div class="float-right">
                                            <span class="text-muted ml-1 small">({{ item.ratings_count }} Ratings)</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </router-link>
                    </div>
                </div>
                <div class="d-block">
                    <div>
                        <pagination class="justify-content-center mt-4" :data="courses" @pagination-change-page="getAllCourses" :showDisabled="true" :limit="10" align="center"></pagination>
                    </div>
                </div>
            </div>
        </template>
    </div>
</template>

<script>
    import axios from 'axios'
    import Pagination from 'laravel-vue-pagination'
    import StarRating from 'vue-star-rating'

    export default {

        components: {
            Pagination, StarRating
        },

        props: ['courses'],

        methods: {
            ratingAverage: function (item) {
                return parseFloat(item.rating_average).toFixed(1)
            }
        }

    }

</script>

<style lang="scss" scoped>
    .search {
        &_image {
            width: 210px;
            height: 118px;
            object-fit: cover;
        }
        &_body {
            cursor: pointer;
        }
        &_body:hover {
            background: whitesmoke;
        }
    }
    .course-header-wrap .course-badge {
        font-size: 9px !important;
    }
    .course-badge.best-seller {
        background: #f4c150;
    }
    .course-header-wrap > div > span {
        margin-right: 12px;
        margin-bottom: 7px;
        font-size: 15px;
    }
    .course-badge {
        color: #29303b;
        box-shadow: 0 0 1px 1px rgba(20,23,28,.1), 0 3px 1px 0 rgba(20,23,28,.1);
        pointer-events: none;
        border-radius: 3px;
        font-size: 9px;
        padding: 1px 8px;
        font-weight: 700;
        position: relative;
        line-height: 1.5;
        text-align: center;
        text-transform: uppercase;
        display: inline-block;
    }
    .course-badge:after {
        border-radius: 3px;
        right: -4px;
        background: inherit;
        content: "";
        height: 11px;
        position: absolute;
        top: 2px;
        transform: rotate(45deg);
        width: 11px;
        z-index: 0;
        display: block;
    }
</style>
