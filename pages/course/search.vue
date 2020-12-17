<template>
    <div>

        <section class="section-sm">
            <div class="container">

                <div class="row">
                    <div class="col-lg-9">
                        <template v-if="!isLoading">
                            <h5 class="mb-0">{{searchResults.length}} results for <b>{{searchQuery}}</b></h5>
                            <hr class="mb-0 mt-4">
                            <div v-if="searchResults.length != 0">
                                <!-- // Main Search  -->
                                <div v-for="(group, key) in groups" :key="key">
                                    <div v-for="(item, key) in group" :key="key">
                                        <div v-if="item.type === 'courses'" class="search_body pt-2 pb-3 pl-2 pr-3 border-bottom">
                                            <router-link :to="{ name: 'course.show', params: { slug: item.searchable.slug } }">
                                                <div class="row justify-content-between">
                                                    <div class="col-lg-auto">
                                                        <img :src="item.searchable.image" class="search_image img-fluid" alt="">
                                                    </div>
                                                    <div class="col-lg-6">
                                                        <h5 class="font-weight-500 text-dasrk">{{item.title}}</h5>
                                                        <div class="rating-row">
                                                            <span class="course-badge best-seller mr-2">{{item.searchable.level}}</span>
                                                            <small class="mr-2">
                                                                <span class="text-other">{{item.searchable.lessons_count}} Lectures &#9679;</span>
                                                                <span class="text-other">{{ item.searchable.students_count }} Students enrolled &#9679;</span>
                                                                <span class="text-other">All Levels</span>
                                                            </small>
                                                        </div>
                                                        <p class="text-muted mt-2" style="font-size: 13px !important;">{{item.searchable.excerpt}} | By {{ item.searchable.user.name }}</p>
                                                    </div>
                                                    <div class="col-lg-2">
                                                        <div class="float-right">
                                                            <template v-if="!item.searchable.free_course">
                                                                <div v-if="item.searchable.has_discount == 0">
                                                                    <h6 class="font-weight-bold text-right">₱{{item.searchable.price | numeral('0,0.00')}}</h6>
                                                                </div>
                                                                <div v-if="item.searchable.has_discount == 1">
                                                                    <h6 class="font-weight-bold text-right">₱{{item.searchable.discount | numeral('0,0.00')}}</h6>
                                                                    <h6 class="text-muted float-right"><strike>₱{{item.searchable.price | numeral('0,0.00')}}</strike></h6>
                                                                </div>
                                                            </template>
                                                            <template v-else>
                                                                <p class="mb-0 text-dark text-right">Free Course</p>
                                                            </template>
                                                            <div class="rating-stars mt-5 mb-0">
                                                                <span class="rating-star-container">
                                                                    <star-rating :star-size="15" :inline="true" :read-only="true" :show-rating="false" :increment="0.5" :rating="item.searchable.rating_average"></star-rating>
                                                                </span>
                                                                <span class="rating-review-numbers">
                                                                    <span class="rating-review-stats">{{ ratingAverage(item) }}</span>
                                                                </span>
                                                            </div>
                                                            <div class="float-right">
                                                                <span class="text-muted ml-1 small">({{ item.searchable.ratings_count }} Ratings)</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </router-link>
                                        </div>
                                    </div>
                                </div>

                                <pagination :data="groups" @pagination-change-page="getSearchResults" align="center" :limit="5" :showDisabled="true"></pagination>

                                <!-- // For beginners -->
                                <div class="mt-5">
                                    <h4>Courses for Beginners</h4>
                                    <client-only>
                                        <carousel :perPage="4" :loop="true" :paginationEnabled="false" :mouse-drag="false" :autoplay="true" easing="ease" :autoWidth="true" :autoHeight="true" :center="true" :navigationEnabled="true" navigationNextLabel="&rsaquo;" navigationPrevLabel="&lsaquo;">
                                            <slide v-for="(course, key) in forBeginners" :key="key" style="margin-right: 10px;" class="py-3">
                                                <router-link :to="{ name: 'course.show', params: { slug: course.slug } }">
                                                    <div class="card border shadow-sm shadow--hover rounded">
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
                                </div>

                                <!-- // Continuation -->
                            </div>

                            <div v-else class="mt-5">
                                <template>
                                    <div>
                                        <h3>Sorry, we couldn't find any results for "{{searchQuery}}"</h3>
                                        <h5 class="mt-4">Try adjusting your search. Here are some ideas:</h5>
                                        <ul class="mt-3 pl-3">
                                            <li>Make sure all words are spelled correctly.</li>
                                            <li>Try different search terms.</li>
                                            <li>Try more general search terms.</li>
                                        </ul>
                                    </div>
                                </template>
                            </div>
                        </template>
                        <template v-else>
                            <div class="text-center">
                                <hr class="mb-0 mt-4">
                                <img class="mt-4" src="https://res.cloudinary.com/dl9phqhv0/image/upload/v1574394025/Loader/ajax-loader_sln1xw.gif" alt="">
                            </div>
                        </template>
                    </div>
                    <div class="col-lg-3">
                        <!-- // Money Back Guarantee -->
                        <div class="sticky-top" style="top: 10px;">
                            <div class="mt-5">
                                <div class="pt-4 pb-2 px-4 border rounded">
                                    <h6><b><fa icon="calendar-alt" class="text-info" /> &nbsp; Not Sure?</b></h6>
                                    <p>Every course comes with a 30-day money-back-guarantee</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </section>
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

        head() {
            return { title: `Searched for "${this.searchQuery}"`}
        },

        watchQuery: ['q'],

        async asyncData({query, error}) {
            try {
                let { data } = await axios.get('/search_query?q=' + query.q)
                return {
                    searchQuery: query.q,
                    forBeginners: data.forBeginners
                }
            } catch (e) {
                error({ statusCode: 500, message: 'Something went wrong!' })
            }
        },

        data: () => ({
            searchResults: [],
            isLoading: false
        }),

        created: function () {
            this.getSearchResults()
        },

        watch: {
            '$route': 'getSearchResults'
        },

        computed: {

            groups: function () {
                return groupBy(this.searchResults, 'groupName')
            },

        },

        methods: {
            getSearchResults: function(page = 1) {
                this.isLoading = true
                axios.get('/search_query?&q=' + this.$route.query.q + '&page=' + page)
                .then((res) => {
                    this.isLoading = false
                    this.searchResults = res.data.searchResults
                }).catch((err) => {
                    this.isLoading = false
                })
            },

            ratingAverage: function (item) {
                return parseFloat(item.searchable.rating_average).toFixed(1)
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
    hr {
        border-top: 0.25rem solid rgba(0, 0, 0, 0.1);
    }

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
    .dropdown-menu-ratings {
        width: 253px;
    }
</style>
