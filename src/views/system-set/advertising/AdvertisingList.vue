<template>
    <div class="manager-container main-bg" style="height:100%">
        <div class="container" style="height:100%; padding: 40px 0 0 0;">
            <h4 style="float:left; color:#007bff; cursor: pointer;">
                <a class="btn-link" title="返回" @click="$router.go(-1)">
                    <icon name="arrow-left"></icon>
                    &nbsp;返回
                </a>
            </h4>
            <h1>公 告 列 表</h1>
            <template>
                <div class="advertising_Index">
                    <loading v-if="isRunning"></loading>
                    <b-row class="cardDiv">
                        <b-col lg="3" md="6" sm="12">
                            <b-input-group :size="template_size">
                                <b-input-group-prepend>
                                    <span class="input-group-text">
                                      <icon name="search"></icon>
                                    </span>
                                </b-input-group-prepend>
                                <b-form-input v-model.lazy="queryDebounceParam.search" placeholder="请输入内容"/>
                            </b-input-group>
                        </b-col>
                    </b-row>
                    <div class="cardDiv">
                        <b-table :items="advertising.list" responsive small hover :fields="columns" head-variant>
                            <template slot="name" slot-scope="row">
                                {{row.item.name}}
                            </template>
                            <template slot="creat_time" slot-scope="row">
                                {{row.item.create_time}}
                            </template>
                            <template slot="preview_icon" slot-scope="row">
                                <b-link :to="row.item.link" style="color:#007bff">
                                    <icon name="eye"></icon>
                                </b-link>
                            </template>
                            <template slot="download_icon" slot-scope="row">
                                <a
                                        :href="row.item.path_docx"
                                        class="btn-link"
                                        title="下载"
                                        target="_blank"
                                >
                                    <icon name="file-word"></icon>
                                </a>
                            </template>
                        </b-table>
                    </div>
                    <b-row class="justify-content-center row-margin-tweak cardDiv">
                        <b-pagination
                                :size="template_size"
                                :total-rows="advertising.total"
                                :per-page="queryParam.size"
                                limit="5"
                                v-model="queryParam.page"

                        />
                    </b-row>
                </div>
            </template>
        </div>
    </div>
</template>
<script>
    import Loading from "@/components/loading/Loading";
    import _ from "lodash";
    import AdvertisingService from "@/services/advertisingService";
    import  {openFile}  from "@/components/previewFile";
    import {mapState} from "vuex";
    export default {
        name: "dictionary_index",
        components: {
            Loading,
        },
        created() {
            this.$nextTick(() => {
                this.queryAdvertisingList();
            });
        },
        data() {
            return {
                ad_name: "",
                public_time: "",
                ad_content: null,
                advertising: {
                    list: [],
                    total: 0
                },
                deleteAdvertising: '',
                columns: {
                    name: {
                        label: "公告名称",
                        sortable: false,
                        class: "text-left field-50"
                    },
                    create_time: {
                        label: "创建时间",
                        sortable: false,
                        class: "text-right field-20"
                    },
                    preview_icon: {
                        label: "预览",
                        sortable: false,
                        class: "text-left field-10"
                    },
                    download_icon: {
                        label: "下载",
                        sortable: false,
                        class: "text-left field-10"
                    },
                },
                queryParam: {
                    page: 1,
                    size: 8
                },
                queryDebounceParam: {
                    search: ""
                },
            };
        },

        watch: {
            queryParam: {
                handler() {
                    this.queryAdvertisingList();
                },
                deep: true
            },
            queryDebounceParam: {
                deep: true,
                handler: _.debounce(function () {
                    this.queryAdvertisingList();
                }, 500)
            },
        },
        computed: {
            ...mapState(["userInfo"])
        },
        methods: {
            queryAdvertisingList(){
                this.run();
                AdvertisingService
                    .getAdvertisingListHome({...this.queryParam, ...this.queryDebounceParam})
                    .then(data => {
                        this.advertising.list = data.results;
                        this.advertising.total = data.paging.count;
                        for (let j = 0; j < this.advertising.list.length; j++) {
                            var arr = this.advertising.list[j].path_html.split("/");
                            this.advertising.list[j].link = "/advertising/" + arr[arr.length - 1].replace(".html", "");
                        }
                        this.$emit("data-ready");
                    })
                    .catch(() => {
                        this.$emit("data-failed");
                    });
            },
            previewFile(fileUrl) {
                openFile(fileUrl, this.userInfo.id)
            },
        }
    };
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">
    .field-50 {
        width: 50%
    }

    .field-20 {
        width: 20%
    }

    .field-10 {
        width: 10%
    }

    .advertising_Index {
        padding: 10px
    }
</style>

