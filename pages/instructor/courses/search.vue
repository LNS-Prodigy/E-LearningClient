<template>
    <div>
        <client-only>
            <offline-alert />
        </client-only>

        <!-- // Add new course -->
        <h2 class="mb-0 m-t-8 font-weight-400"><img src="https://res.cloudinary.com/dl9phqhv0/image/upload/c_scale,h_60/v1576222206/Logos/online-learning_osijg7.svg" style="width: 60px; height: 60px;" alt=""> &nbsp; Courses</h2>

        <!-- // Table of courses -->
        <div class="mt-4">
            <div class="row">
                <div class="col-lg-12 h-100">

                    <div class="row">

                        <div class="col-lg-4">
                            <form class="my-auto">
                                <div class="input-group input-group-alternative">
                                    <input aria-describedby="addon-right addon-left" type="text" name="search" placeholder="Search for courses" class="form-inline form-control rounded-left search-welcome">
                                    <div class="input-group-prepend">
                                        <span class="input-group-text btn btn-default rounded-right p-lg-3">
                                            <fa icon="search" fixed-width />
                                        </span>
                                    </div>
                                </div>
                            </form>
                        </div>

                        <div class="col-lg-2">
                            <div class="dropdown">
                                <button class="btn btn-default dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    Filter
                                </button>
                                <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                    <a class="dropdown-item" href="#">Action</a>
                                    <a class="dropdown-item" href="#">Another action</a>
                                    <a class="dropdown-item" href="#">Something else here</a>
                                </div>
                            </div>
                        </div>

                        <div class="col-lg-6">
                            <router-link :to="{ name: 'instructor.courses.create' }" class="btn btn-outline-default rounded float-right">
                                <fa icon="plus" fixed-width />
                                Add New Course
                            </router-link>
                        </div>

                    </div>

                    <card class="shadow-sm mt-3">
                        <h4 class="mb-3 header-title"><b>Course list</b></h4>

                        <div v-if="isLoading">
                            <section class="section">
                                <div class="container text-center">
                                    <img src="https://res.cloudinary.com/dl9phqhv0/image/upload/v1574394025/Loader/ajax-loader_sln1xw.gif" alt="">
                                </div>
                            </section>
                        </div>

                        <div v-else>
                            <div v-if="searchResults == 0">
                                <section class="section">
                                    <div class="row justify-content-center">
                                        <div class="col-lg-12">
                                            <div class="text-center">
                                                <img style="opacity: 1;" width="100" src="http://demo.academy-lms.com/default/assets/backend/images/file-search.svg"><br>
                                                No data found
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            </div>

                            <div v-else>
                                <!-- // Entries and Search -->

                                <table class="table table-striped dt-responsive nowrap dataTable no-footer dtr-inline collapsed" width="100%" data-page-length="25" role="grid" aria-describedby="course-datatable-server-side_info" style="width: 100%;">
                                    <thead>
                                        <th class="sorting_disabled" rowspan="1" colspan="1" style="width: 353.6px;" aria-label="Title">Title</th>
                                        <th class="sorting_disabled" rowspan="1" colspan="1" style="width: 66.6px;" aria-label="Category">Category</th>
                                        <th class="sorting_disabled" rowspan="1" colspan="1" style="width: 133.6px;" aria-label="Lesson and section">Lesson and section</th>
                                        <th class="sorting_disabled" rowspan="1" colspan="1" style="width: 115.6px;" aria-label="Enrolled student">Enrolled student</th>
                                        <th class="sorting_disabled" rowspan="1" colspan="1" style="width: 46.6px;" aria-label="Status">Status</th>
                                    </thead>
                                    <tbody v-if="searchResults.length != 0">
                                        <div v-for="(group, key) in groups" :key="key">
                                            <div v-for="(item, key) in group" :key="key">
                                                <tr role="row" class="odd">
                                                    <td>
                                                        <router-link :to="{ name: 'instructor.courses.edit', params: { slug: item.slug } }">
                                                            {{item.title}}
                                                        </router-link>
                                                        <br>
                                                        <small class="text-muted">
                                                            <span style="font-size: 11px;">Instructor: &nbsp; <b>{{item.user.name}}</b></span>
                                                        </small>
                                                    </td>
                                                    <td>
                                                        <span class="badge badge-dark" style="font-size: 9px;">{{item.category.name}}</span>
                                                    </td>
                                                    <td style="font-size: 13px;">
                                                        <small class="text-muted"><b>Total section</b>: 3</small><br>
                                                        <small class="text-muted"><b>Total lesson</b>: 7</small><br>
                                                    </td>
                                                    <td style="font-size: 12px;">
                                                        <small class="text-muted"><b>Total enrolment</b>: 0</small>
                                                    </td>
                                                    <td style="font-size: 12px;">
                                                        <span class="badge badge-success" v-if="item.status === 'APPROVED'">{{item.status}}</span>
                                                        <span class="badge badge-success" v-if="item.status === 'PUBLISHED'">{{item.status}}</span>
                                                        <span class="badge badge-warning" v-if="item.status === 'PENDING'">{{item.status}}</span>
                                                        <span class="badge badge-default" v-if="item.status === 'DRAFT'">{{item.status}}</span>
                                                        <span class="badge badge-default" v-if="item.status === 'UNPUBLISHED'">{{item.status}}</span>
                                                    </td>
                                                    <td style="display: none;">
                                                        <span class="badge badge-dark-lighten">$1800</span>
                                                    </td>
                                                    <td style="display: none;">
                                                        <div class="dropright dropright">
                                                            <button type="button" class="btn btn-sm btn-outline-primary btn-rounded btn-icon" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                                <i class="mdi mdi-dots-vertical"></i>
                                                            </button>
                                                            <ul class="dropdown-menu">
                                                                <li><a class="dropdown-item" href="http://demo.academy-lms.com/default/home/course/how-to-shoot-b-roll-footage-with-peter-mckinnon/26" target="_blank">View course on frontend</a></li>
                                                                <li><a class="dropdown-item" href="http://demo.academy-lms.com/default/user/course_form/course_edit/26">Edit this course</a></li>
                                                                <li><a class="dropdown-item" href="http://demo.academy-lms.com/default/user/course_form/course_edit/26">Section and lesson</a></li>
                                                                <li><a class="dropdown-item" href="javascript::" onclick="confirm_modal('http://demo.academy-lms.com/default/user/course_actions/draft/26')">Mark as drafted</a></li>
                                                                <li><a class="dropdown-item" href="javascript::" onclick="confirm_modal('http://demo.academy-lms.com/default/user/course_actions/delete/26')">Delete</a></li>
                                                            </ul>
                                                        </div>
                                                    </td>
                                                </tr>
                                            </div>
                                        </div>
                                    </tbody>
                                </table>
                                <!-- <pagination :data="allCourses" @pagination-change-page="getCourses"></pagination> -->
                            </div>
                        </div>
                    </card>

                </div>
            </div>
        </div>

    </div>
</template>


<script>
   
    import axios from 'axios'

    export default {
        
        head() {
            return { title: `Searched for ${this.searchQuery}`}
        },

        watchQuery: ['search_query'],

        async asyncData({ query }) {
            try {
                let { data } = await axios.get('/instructor/courses/search/search_query?=' + query.search_query)
                return {
                    searchQuery: query.search_query
                }
            } catch (e) {
            }
        },

        data: function () {
            return {
                searchResults: [],
                isLoading: false
            }
        },

        created: function () {
            this.getSearchResults()
        },

        watch: {
            '$route' : 'getSearchResults'
        },

        computed: {
            groups: function () {
                return groupBy(this.searchResults, 'groupName')
            }
        },

        methods: {
            async getSearchResults(page = 1) {
                this.isLoading = true
                await axios.get('/instructor/courses/search/search_query?=' + this.$route.query.search_query)

                .then((res) => {
                    this.isLoading = false
                    this.searchResults = res.data.searchResults
                })

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
        const results = {}
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