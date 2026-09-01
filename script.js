// ========================================
// Trip Shiori
// ========================================


// ========================================
// 共通
// ========================================

const $ = (selector) => {
    return document.querySelector(selector);
};


// ========================================
// 金額表示
// ========================================

function formatYen(number) {

    return new Intl.NumberFormat(
        "ja-JP",
        {
            style: "currency",
            currency: "JPY",
            maximumFractionDigits: 0
        }
    ).format(number || 0);

}


// ========================================
// 日付表示
// ========================================

function formatDate(date) {

    if (!date) {
        return "";
    }

    const d =
        new Date(
            date + "T00:00:00"
        );

    if (
        Number.isNaN(
            d.getTime()
        )
    ) {
        return "";
    }

    return (
        d.getFullYear()
        + "/"
        + String(
            d.getMonth() + 1
        ).padStart(2, "0")
        + "/"
        + String(
            d.getDate()
        ).padStart(2, "0")
    );

}


// ========================================
// 日付を1日前にする
// ========================================

function getPreviousDate(dateString) {

    if (!dateString) {
        return "";
    }

    const date =
        new Date(
            dateString + "T00:00:00"
        );

    if (
        Number.isNaN(
            date.getTime()
        )
    ) {
        return "";
    }

    date.setDate(
        date.getDate() - 1
    );

    return [
        date.getFullYear(),
        String(
            date.getMonth() + 1
        ).padStart(2, "0"),
        String(
            date.getDate()
        ).padStart(2, "0")
    ].join("-");

}


// ========================================
// 日付を1日後にする
// ========================================

function getNextDate(dateString) {

    if (!dateString) {
        return "";
    }

    const date =
        new Date(
            dateString + "T00:00:00"
        );

    if (
        Number.isNaN(
            date.getTime()
        )
    ) {
        return "";
    }

    date.setDate(
        date.getDate() + 1
    );

    return [
        date.getFullYear(),
        String(
            date.getMonth() + 1
        ).padStart(2, "0"),
        String(
            date.getDate()
        ).padStart(2, "0")
    ].join("-");

}


// ========================================
// HTML特殊文字対策
// ========================================

function escapeHtml(text) {

    const div =
        document.createElement(
            "div"
        );

    div.textContent =
        text || "";

    return div.innerHTML;

}


// ========================================
// URLリンク
// ========================================

function createUrlLink(url) {

    if (!url) {
        return "";
    }

    try {

        const parsedUrl =
            new URL(
                url
            );

        if (
            parsedUrl.protocol !== "http:"
            &&
            parsedUrl.protocol !== "https:"
        ) {
            return "";
        }

        return `
            <a
                class="schedule-url-link"
                href="${escapeHtml(
                    parsedUrl.href
                )}"
                target="_blank"
                rel="noopener noreferrer"
            >
                🔗 詳細を見る
            </a>
        `;

    }
    catch (error) {

        return "";

    }

}


// ========================================
// 宿泊地表示
// ========================================

function updateStayVisibility() {

    const startDate =
        $("#startDate")?.value
        || "";

    const endDate =
        $("#endDate")?.value
        || "";

    const stayButton =
        $("#addStayButton");

    const stayHeader =
        stayButton
            ? stayButton.closest(
                ".section-header"
            )
            : null;

    const stayList =
        $("#stayList");


    if (
        !stayHeader
        ||
        !stayList
    ) {
        return;
    }


    // 日付未入力

    if (
        !startDate
        ||
        !endDate
    ) {

        stayHeader.style.display =
            "none";

        stayList.style.display =
            "none";

        return;

    }


    // 日帰り

    if (
        startDate >= endDate
    ) {

        stayHeader.style.display =
            "none";

        stayList.style.display =
            "none";

        return;

    }


    // 宿泊あり

    stayHeader.style.display =
        "";

    stayList.style.display =
        "";

    // 泊数自動生成のためボタンは非表示

    stayButton.style.display =
        "none";

}


// ========================================
// 宿泊地自動生成
// ========================================

function regenerateStays() {

    const stayList =
        $("#stayList");

    const stayTemplate =
        $("#stayTemplate");

    if (
        !stayList
        ||
        !stayTemplate
    ) {
        return;
    }


    const startDate =
        $("#startDate")?.value
        || "";

    const endDate =
        $("#endDate")?.value
        || "";


    // ------------------------------------
    // 現在の入力内容を保存
    // ------------------------------------

    const existingStays = {};


    stayList
        .querySelectorAll(
            ".stay-item"
        )
        .forEach(
            function (item) {

                const dateInput =
                    item.querySelector(
                        ".stay-date"
                    );

                const placeInput =
                    item.querySelector(
                        ".stay-place"
                    );

                if (
                    dateInput
                    &&
                    placeInput
                    &&
                    dateInput.value
                ) {

                    existingStays[
                        dateInput.value
                    ] =
                        placeInput.value;

                }

            }
        );


    // ------------------------------------
    // 既存欄を削除
    // ------------------------------------

    stayList.innerHTML =
        "";


    // ------------------------------------
    // 宿泊なし
    // ------------------------------------

    if (
        !startDate
        ||
        !endDate
        ||
        startDate >= endDate
    ) {

        updateStayVisibility();

        return;

    }


    // ------------------------------------
    // 最後の宿泊日は終了日の前日
    // ------------------------------------

    const lastStayDate =
        getPreviousDate(
            endDate
        );


    let currentDate =
        startDate;


    // ------------------------------------
    // 泊数分生成
    // ------------------------------------

    while (
        currentDate <= lastStayDate
    ) {

        const fragment =
            stayTemplate.content.cloneNode(
                true
            );


        const item =
            fragment.querySelector(
                ".stay-item"
            );


        if (!item) {
            break;
        }


        const dateInput =
            item.querySelector(
                ".stay-date"
            );

        const placeInput =
            item.querySelector(
                ".stay-place"
            );

        const deleteButton =
            item.querySelector(
                ".delete-button"
            );


        if (
            !dateInput
            ||
            !placeInput
        ) {
            break;
        }


        dateInput.value =
            currentDate;


        dateInput.min =
            startDate;


        dateInput.max =
            lastStayDate;


        placeInput.value =
            existingStays[
                currentDate
            ]
            || "";


        if (deleteButton) {

            deleteButton.style.display =
                "none";

        }


        placeInput.addEventListener(
            "input",
            updatePreview
        );


        dateInput.addEventListener(
            "change",
            updatePreview
        );


        stayList.appendChild(
            fragment
        );


        currentDate =
            getNextDate(
                currentDate
            );

    }


    updateStayVisibility();

}


// ========================================
// 行程・費用の日付範囲
// ========================================

function updateDateRange() {

    const startDate =
        $("#startDate")?.value
        || "";

    const endDate =
        $("#endDate")?.value
        || "";


    // ------------------------------------
    // 開始日・終了日の整合性
    // ------------------------------------

    const endDateInput =
        $("#endDate");


    if (endDateInput) {

        if (
            startDate
            &&
            endDate
            &&
            startDate > endDate
        ) {

            endDateInput.setCustomValidity(
                "終了日は開始日以降の日付にしてください。"
            );

        }
        else {

            endDateInput.setCustomValidity(
                ""
            );

        }

    }


    // ------------------------------------
    // 行程
    // ------------------------------------

    document
        .querySelectorAll(
            ".schedule-date"
        )
        .forEach(
            function (input) {

                input.min =
                    startDate
                    || "";

                input.max =
                    endDate
                    || "";

            }
        );


    // ------------------------------------
    // 費用
    // ------------------------------------

    document
        .querySelectorAll(
            ".cost-date"
        )
        .forEach(
            function (input) {

                input.min =
                    startDate
                    || "";

                input.max =
                    endDate
                    || "";

            }
        );


    // ------------------------------------
    // 宿泊地
    // ------------------------------------

    regenerateStays();

}


// ========================================
// 地図
// ========================================

let map = null;

const markerMap =
    new Map();

let scheduleIdCounter =
    0;


// ========================================
// 地図初期化
// ========================================

function initializeMap() {

    const mapElement =
        $("#map");


    if (!mapElement) {
        return;
    }


    if (
        typeof L === "undefined"
    ) {

        console.error(
            "Leafletが読み込まれていません。"
        );

        return;

    }


    if (map !== null) {
        return;
    }


    map =
        L.map(
            mapElement
        ).setView(
            [
                35.681236,
                139.767125
            ],
            13
        );


    L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
            maxZoom: 19,

            attribution:
                "&copy; OpenStreetMap contributors"
        }
    ).addTo(map);


    setTimeout(
        function () {

            if (map) {

                map.invalidateSize();

            }

        },
        200
    );

}


// ========================================
// 日付別マーカー色
// ========================================

function getScheduleMarkerColor(
    date
) {

    if (!date) {
        return "#555555";
    }


    const startDate =
        $("#startDate")?.value
        || "";


    if (!startDate) {
        return "#555555";
    }


    const start =
        new Date(
            startDate + "T00:00:00"
        );


    const target =
        new Date(
            date + "T00:00:00"
        );


    const dayIndex =
        Math.round(
            (
                target.getTime()
                -
                start.getTime()
            )
            /
            (
                24
                *
                60
                *
                60
                *
                1000
            )
        );


    const colors = [

        "#2563EB",
        "#16A34A",
        "#EA580C",
        "#9333EA",
        "#DC2626",
        "#0891B2",
        "#CA8A04"

    ];


    return (
        colors[dayIndex]
        ||
        "#555555"
    );

}


// ========================================
// 行程番号
// ========================================

function getScheduleNumber(
    targetItem
) {

    const targetDate =
        targetItem.querySelector(
            ".schedule-date"
        )?.value
        || "";


    const schedules =
        Array.from(
            document.querySelectorAll(
                ".schedule-item"
            )
        );


    const activeSchedules =
        schedules.filter(
            function (item) {

                const time =
                    item.querySelector(
                        ".schedule-time"
                    )?.value
                    || "";

                const place =
                    item.querySelector(
                        ".schedule-place"
                    )?.value
                    || "";

                const content =
                    item.querySelector(
                        ".schedule-content"
                    )?.value
                    || "";

                const transport =
                    item.querySelector(
                        ".schedule-transport"
                    )?.value
                    || "";

                const url =
                    item.querySelector(
                        ".schedule-url"
                    )?.value
                    || "";


                return (
                    time
                    ||
                    place
                    ||
                    content
                    ||
                    transport
                    ||
                    url
                );

            }
        );


    activeSchedules.sort(
        function (a, b) {

            const dateA =
                a.querySelector(
                    ".schedule-date"
                )?.value
                || "9999-12-31";


            const dateB =
                b.querySelector(
                    ".schedule-date"
                )?.value
                || "9999-12-31";


            if (
                dateA !== dateB
            ) {

                return dateA.localeCompare(
                    dateB
                );

            }


            const timeA =
                a.querySelector(
                    ".schedule-time"
                )?.value
                || "99:99";


            const timeB =
                b.querySelector(
                    ".schedule-time"
                )?.value
                || "99:99";


            return timeA.localeCompare(
                timeB
            );

        }
    );


    const sameDay =
        activeSchedules.filter(
            function (item) {

                return (
                    item.querySelector(
                        ".schedule-date"
                    )?.value
                    ===
                    targetDate
                );

            }
        );


    return (
        sameDay.indexOf(
            targetItem
        )
        +
        1
    );

}


// ========================================
// 場所検索文字列を整理
// ========================================

function normalizePlaceQuery(
    text
) {

    if (!text) {
        return "";
    }


    let query =
        text.trim();


    query =
        query.replace(
            /\r?\n/g,
            " "
        );


    query =
        query.replace(
            /　+/g,
            " "
        );


    query =
        query.replace(
            /〒\s*/g,
            ""
        );


    return query.trim();

}


// ========================================
// 住所かどうか判定
// ========================================

function looksLikeAddress(
    text
) {

    if (!text) {
        return false;
    }


    // 郵便番号

    if (
        /\d{3}[-ー−]?\d{4}/.test(
            text
        )
    ) {

        return true;

    }


    // 日本の一般的な住所

    if (
        /(?:東京都|北海道|(?:大阪|京都)府|.{2,3}県)/.test(
            text
        )
        &&
        /(?:市|区|町|村)/.test(
            text
        )
    ) {

        return true;

    }


    // 丁目・番地・号

    if (
        /(?:丁目|番地|番|号)/.test(
            text
        )
    ) {

        return true;

    }


    return false;

}


// ========================================
// 検索結果の候補名を取得
// ========================================

function getCandidateNames(
    result
) {

    const names = [];


    // namedetails

    if (
        result.namedetails
    ) {

        Object.values(
            result.namedetails
        ).forEach(
            function (name) {

                if (
                    typeof name === "string"
                ) {

                    names.push(
                        name
                    );

                }

            }
        );

    }


    // address

    const address =
        result.address
        ||
        {};


    [
        "amenity",
        "building",
        "shop",
        "tourism",
        "attraction",
        "station",
        "railway",
        "name"
    ].forEach(
        function (key) {

            if (
                address[key]
            ) {

                names.push(
                    address[key]
                );

            }

        }
    );


    // display_name

    if (
        result.display_name
    ) {

        names.push(
            result.display_name
        );

    }


    return names;

}


// ========================================
// 検索結果の評価
// ========================================

function scoreSearchResult(
    result,
    originalQuery,
    mode
) {

    const query =
        normalizePlaceQuery(
            originalQuery
        ).toLowerCase();


    const names =
        getCandidateNames(
            result
        )
        .join(" ")
        .toLowerCase();


    const category =
        (
            result.category
            ||
            ""
        ).toLowerCase();


    const type =
        (
            result.type
            ||
            ""
        ).toLowerCase();


    const addresstype =
        (
            result.addresstype
            ||
            ""
        ).toLowerCase();


    let score = 0;


    // ------------------------------------
    // 完全一致
    // ------------------------------------

    if (
        result.namedetails
    ) {

        const exact =
            Object.values(
                result.namedetails
            ).some(
                function (name) {

                    return (
                        typeof name === "string"
                        &&
                        name.toLowerCase()
                        ===
                        query
                    );

                }
            );


        if (exact) {

            score += 200;

        }

    }


    // ------------------------------------
    // 名前に含まれる
    // ------------------------------------

    if (
        names.includes(
            query
        )
    ) {

        score += 100;

    }


    // ====================================
    // 施設名検索
    // ====================================

    if (
        mode === "place"
    ) {

        // POI優先

        if (
            category === "tourism"
            ||
            category === "amenity"
            ||
            category === "shop"
            ||
            category === "leisure"
            ||
            category === "historic"
        ) {

            score += 70;

        }


        // 駅の場合

        if (
            query.includes("駅")
        ) {

            if (
                category === "railway"
                &&
                (
                    type === "station"
                    ||
                    type.includes("station")
                )
            ) {

                score += 150;

            }


            // ホーム・停止位置などは下げる

            if (
                type.includes("platform")
                ||
                type === "stop"
            ) {

                score -= 120;

            }

        }

    }


    // ====================================
    // 住所検索
    // ====================================

    if (
        mode === "address"
    ) {

        if (
            addresstype === "house"
            ||
            addresstype === "building"
            ||
            type === "house"
        ) {

            score += 150;

        }


        if (
            result.address
            &&
            result.address.house_number
        ) {

            score += 80;

        }

    }


    // ------------------------------------
    // 重要度
    // ------------------------------------

    const importance =
        Number(
            result.importance
        );


    if (
        Number.isFinite(
            importance
        )
    ) {

        score +=
            importance
            * 50;

    }


    return score;

}


// ========================================
// 最適候補を取得
// ========================================

function chooseBestSearchResult(
    results,
    originalQuery,
    mode
) {

    if (
        !Array.isArray(results)
        ||
        results.length === 0
    ) {

        return null;

    }


    const scored =
        results.map(
            function (result) {

                return {

                    result:
                        result,

                    score:
                        scoreSearchResult(
                            result,
                            originalQuery,
                            mode
                        )

                };

            }
        );


    scored.sort(
        function (a, b) {

            return (
                b.score
                -
                a.score
            );

        }
    );


    console.log(
        "地図検索候補:",
        scored
    );


    return (
        scored[0]
            ?.result
        ||
        null
    );

}


// ========================================
// Nominatimを1回だけ検索
// ========================================

async function searchLocation(
    originalQuery
) {

    const query =
        normalizePlaceQuery(
            originalQuery
        );


    if (!query) {

        return null;

    }


    const mode =
        looksLikeAddress(
            query
        )
            ? "address"
            : "place";


    // ------------------------------------
    // 検索対象
    // ------------------------------------

    const layer =
        mode === "address"
            ? "address,manmade"
            : "poi,railway,manmade";


    const params =
        new URLSearchParams();


    params.set(
        "q",
        query
    );


    params.set(
        "format",
        "jsonv2"
    );


    params.set(
        "limit",
        "5"
    );


    params.set(
        "addressdetails",
        "1"
    );


    params.set(
        "namedetails",
        "1"
    );


    params.set(
        "countrycodes",
        "jp"
    );


    params.set(
        "layer",
        layer
    );


    params.set(
        "accept-language",
        "ja"
    );


    const searchUrl =
        "https://nominatim.openstreetmap.org/search?"
        +
        params.toString();


    console.log(
        "地図検索:",
        searchUrl
    );


    const response =
        await fetch(
            searchUrl
        );


    if (!response.ok) {

        throw new Error(
            "Nominatim HTTP "
            +
            response.status
        );

    }


    const results =
        await response.json();


    return chooseBestSearchResult(
        results,
        query,
        mode
    );

}


// ========================================
// 地図に場所を登録
// ========================================

async function addLocationToMap(
    item
) {

    const placeInput =
        item.querySelector(
            ".schedule-place"
        );


    const status =
        item.querySelector(
            ".map-status"
        );


    if (
        !placeInput
        ||
        !status
    ) {

        return;

    }


    const originalPlace =
        placeInput.value.trim();


    if (!originalPlace) {

        status.textContent =
            "場所または住所を入力してください。";

        return;

    }


    if (!map) {

        status.textContent =
            "地図がまだ読み込まれていません。";

        return;

    }


    status.textContent =
        "📍 場所を検索しています…";


    try {

        // --------------------------------
        // Nominatim検索
        // 1回だけ実行
        // --------------------------------

        const result =
            await searchLocation(
                originalPlace
            );


        if (!result) {

            status.textContent =
                "場所・住所が見つかりませんでした。";

            return;

        }


        const latitude =
            Number(
                result.lat
            );


        const longitude =
            Number(
                result.lon
            );


        if (
            !Number.isFinite(
                latitude
            )
            ||
            !Number.isFinite(
                longitude
            )
        ) {

            throw new Error(
                "緯度・経度が取得できませんでした。"
            );

        }


        // --------------------------------
        // 行程ID
        // --------------------------------

        const scheduleId =
            item.dataset.scheduleId;


        // --------------------------------
        // 既存マーカー削除
        // --------------------------------

        if (
            markerMap.has(
                scheduleId
            )
        ) {

            map.removeLayer(
                markerMap.get(
                    scheduleId
                )
            );


            markerMap.delete(
                scheduleId
            );

        }


        // --------------------------------
        // 番号
        // --------------------------------

        const markerNumber =
            getScheduleNumber(
                item
            );


        // --------------------------------
        // 日付
        // --------------------------------

        const scheduleDate =
            item.querySelector(
                ".schedule-date"
            )?.value
            || "";


        // --------------------------------
        // 色
        // --------------------------------

        const markerColor =
            getScheduleMarkerColor(
                scheduleDate
            );


        // --------------------------------
        // SVG番号付きマーカー
        // --------------------------------

        const icon =
            L.divIcon({

                className:
                    "numbered-marker-wrapper",

                html: `
                    <svg
                        width="40"
                        height="50"
                        viewBox="0 0 40 50"
                        xmlns="http://www.w3.org/2000/svg"
                    >

                        <path
                            d="
                                M20 1
                                C9.5 1 1 9.5 1 20
                                C1 34 20 49 20 49
                                C20 49 39 34 39 20
                                C39 9.5 30.5 1 20 1
                                Z
                            "
                            fill="${markerColor}"
                            stroke="#ffffff"
                            stroke-width="2"
                        />


                        <text
                            x="20"
                            y="20"
                            text-anchor="middle"
                            dominant-baseline="central"
                            fill="#ffffff"
                            font-size="16"
                            font-weight="700"
                            font-family="Arial, sans-serif"
                        >
                            ${markerNumber}
                        </text>

                    </svg>
                `,

                iconSize:
                    [
                        40,
                        50
                    ],

                iconAnchor:
                    [
                        20,
                        50
                    ],

                popupAnchor:
                    [
                        0,
                        -50
                    ]

            });


        // --------------------------------
        // マーカー
        // --------------------------------

        const marker =
            L.marker(
                [
                    latitude,
                    longitude
                ],
                {
                    icon:
                        icon
                }
            ).addTo(
                map
            );


        // --------------------------------
        // ポップアップ
        // --------------------------------

        marker.bindPopup(
            "<strong>"
            +
            escapeHtml(
                originalPlace
            )
            +
            "</strong>"
            +
            "<br>"
            +
            "<small>"
            +
            escapeHtml(
                result.display_name
                ||
                ""
            )
            +
            "</small>"
        );


        // --------------------------------
        // 保存
        // --------------------------------

        markerMap.set(
            scheduleId,
            marker
        );


        // --------------------------------
        // 地図移動
        // --------------------------------

        map.setView(
            [
                latitude,
                longitude
            ],
            16
        );


        marker.openPopup();


        status.textContent =
            "✓ 地図に登録しました。";

    }
    catch (error) {

        console.error(
            "地図検索エラー:",
            error
        );


        // HTTP 429などを具体的に表示

        if (
            error.message
            &&
            error.message.includes(
                "429"
            )
        ) {

            status.textContent =
                "検索回数が多いため、一時的に制限されています。少し待ってから再度お試しください。";

        }
        else {

            status.textContent =
                "地図検索中にエラーが発生しました。";

        }

    }

}


// ========================================
// 行程追加
// ========================================

function addSchedule() {

    const template =
        $("#scheduleTemplate");


    if (!template) {

        console.error(
            "scheduleTemplateが見つかりません。"
        );

        return;

    }


    const fragment =
        template.content.cloneNode(
            true
        );


    const item =
        fragment.querySelector(
            ".schedule-item"
        );


    if (!item) {
        return;
    }


    scheduleIdCounter++;


    item.dataset.scheduleId =
        String(
            scheduleIdCounter
        );


    // --------------------------------
    // 開始日
    // --------------------------------

    const dateInput =
        item.querySelector(
            ".schedule-date"
        );


    if (dateInput) {

        dateInput.value =
            $("#startDate")?.value
            || "";

    }


    // --------------------------------
    // 削除
    // --------------------------------

    const deleteButton =
        item.querySelector(
            ".delete-button"
        );


    if (deleteButton) {

        deleteButton.addEventListener(
            "click",
            function () {

                const scheduleId =
                    item.dataset.scheduleId;


                if (
                    markerMap.has(
                        scheduleId
                    )
                ) {

                    if (map) {

                        map.removeLayer(
                            markerMap.get(
                                scheduleId
                            )
                        );

                    }


                    markerMap.delete(
                        scheduleId
                    );

                }


                item.remove();


                updatePreview();

            }
        );

    }


    // --------------------------------
    // 地図登録
    // --------------------------------

    const mapButton =
        item.querySelector(
            ".map-add-button"
        );


    if (mapButton) {

        mapButton.addEventListener(
            "click",
            function () {

                addLocationToMap(
                    item
                );

            }
        );

    }


    // --------------------------------
    // 入力
    // --------------------------------

    item.querySelectorAll(
        "input"
    ).forEach(
        function (input) {

            input.addEventListener(
                "input",
                updatePreview
            );


            input.addEventListener(
                "change",
                updatePreview
            );

        }
    );


    // --------------------------------
    // 追加
    // --------------------------------

    $("#scheduleList")
        .appendChild(
            fragment
        );


    updateDateRange();

    updatePreview();

}


// ========================================
// 費用追加
// ========================================

function addCost() {

    const template =
        $("#costTemplate");


    if (!template) {

        console.error(
            "costTemplateが見つかりません。"
        );

        return;

    }


    const fragment =
        template.content.cloneNode(
            true
        );


    const item =
        fragment.querySelector(
            ".cost-item"
        );


    if (!item) {
        return;
    }


    const dateInput =
        item.querySelector(
            ".cost-date"
        );


    if (dateInput) {

        dateInput.value =
            $("#startDate")?.value
            || "";

    }


    // --------------------------------
    // 削除
    // --------------------------------

    const deleteButton =
        item.querySelector(
            ".delete-button"
        );


    if (deleteButton) {

        deleteButton.addEventListener(
            "click",
            function () {

                item.remove();

                updatePreview();

            }
        );

    }


    // --------------------------------
    // 入力
    // --------------------------------

    item.querySelectorAll(
        "input, select"
    ).forEach(
        function (input) {

            input.addEventListener(
                "input",
                updatePreview
            );


            input.addEventListener(
                "change",
                updatePreview
            );

        }
    );


    $("#costList")
        .appendChild(
            fragment
        );


    updateDateRange();

    updatePreview();

}


// ========================================
// 移動手段アイコン
// ========================================

function getTransportIcon(
    transport
) {

    const text =
        transport || "";


    if (
        text.includes("新幹線")
        ||
        text.includes("電車")
        ||
        text.includes("鉄道")
    ) {

        return "🚃";

    }


    if (
        text.includes("バス")
    ) {

        return "🚌";

    }


    if (
        text.includes("飛行機")
        ||
        text.includes("航空")
    ) {

        return "✈️";

    }


    if (
        text.includes("タクシー")
    ) {

        return "🚕";

    }


    if (
        text.includes("車")
        ||
        text.includes("自動車")
    ) {

        return "🚗";

    }


    if (
        text.includes("船")
        ||
        text.includes("フェリー")
    ) {

        return "⛴️";

    }


    if (
        text.includes("自転車")
    ) {

        return "🚲";

    }


    return "🚶";

}


// ========================================
// 行程プレビュー
// ========================================

function buildSchedulePreview() {

    const items =
        Array.from(
            document.querySelectorAll(
                ".schedule-item"
            )
        );


    const data = [];


    items.forEach(
        function (item) {

            const date =
                item.querySelector(
                    ".schedule-date"
                )?.value
                || "";


            const time =
                item.querySelector(
                    ".schedule-time"
                )?.value
                || "";


            const place =
                item.querySelector(
                    ".schedule-place"
                )?.value
                || "";


            const content =
                item.querySelector(
                    ".schedule-content"
                )?.value
                || "";


            const transport =
                item.querySelector(
                    ".schedule-transport"
                )?.value
                || "";


            const url =
                item.querySelector(
                    ".schedule-url"
                )?.value
                || "";


            if (
                !date
                &&
                !time
                &&
                !place
                &&
                !content
                &&
                !transport
                &&
                !url
            ) {

                return;

            }


            data.push({

                id:
                    item.dataset.scheduleId,

                date:
                    date,

                time:
                    time,

                place:
                    place,

                content:
                    content,

                transport:
                    transport,

                url:
                    url

            });

        }
    );


    // --------------------------------
    // 日付・時刻順
    // --------------------------------

    data.sort(
        function (a, b) {

            const dateA =
                a.date
                ||
                "9999-12-31";


            const dateB =
                b.date
                ||
                "9999-12-31";


            if (
                dateA !== dateB
            ) {

                return dateA.localeCompare(
                    dateB
                );

            }


            const timeA =
                a.time
                ||
                "99:99";


            const timeB =
                b.time
                ||
                "99:99";


            return timeA.localeCompare(
                timeB
            );

        }
    );


    // --------------------------------
    // 日付ごと
    // --------------------------------

    const groups = {};


    data.forEach(
        function (schedule) {

            const date =
                schedule.date
                ||
                "no-date";


            if (!groups[date]) {

                groups[date] = [];

            }


            groups[date].push(
                schedule
            );

        }
    );


    let html = "";

    let dayNumber = 0;


    Object.keys(
        groups
    ).forEach(
        function (date) {

            dayNumber++;


            const schedulesForDay =
                groups[date];


            const dayTitle =
                date === "no-date"
                    ? "日付未設定"
                    : formatDate(date);


            html += `

                <div class="day-section">

                    <div class="day-header">

                        <span class="day-number">
                            ${dayNumber}日目
                        </span>


                        <span class="day-date">
                            ${dayTitle}
                        </span>

                    </div>


                    <div class="timeline">

            `;


            // --------------------------------
            // 行程
            // --------------------------------

            schedulesForDay.forEach(
                function (
                    schedule,
                    index
                ) {

                    const icon =
                        getTransportIcon(
                            schedule.transport
                        );


                    const urlLink =
                        createUrlLink(
                            schedule.url
                        );


                    const hasNext =
                        index
                        <
                        schedulesForDay.length - 1;


                    html += `

                        <div
                            class="timeline-item timeline-clickable"
                            data-schedule-id="${schedule.id}"
                        >

                            <div class="timeline-time">

                                <strong>
                                    ${
                                        schedule.time
                                        ||
                                        "--:--"
                                    }
                                </strong>

                            </div>


                            <div class="timeline-line">

                                <div
                                    class="timeline-dot"
                                ></div>


                                ${
                                    hasNext
                                    ? `
                                        <div
                                            class="timeline-connector"
                                        ></div>
                                    `
                                    : ""
                                }

                            </div>


                            <div class="timeline-content">

                                <div class="timeline-place">

                                    ${
                                        escapeHtml(
                                            schedule.place
                                        )
                                        ||
                                        "場所未入力"
                                    }

                                </div>


                                ${
                                    schedule.content
                                    ? `
                                        <div
                                            class="timeline-description"
                                        >
                                            ${escapeHtml(
                                                schedule.content
                                            )}
                                        </div>
                                    `
                                    : ""
                                }


                                ${
                                    schedule.transport
                                    ? `
                                        <div
                                            class="timeline-transport"
                                        >

                                            <span>
                                                ${icon}
                                            </span>


                                            <span>
                                                ${escapeHtml(
                                                    schedule.transport
                                                )}
                                            </span>

                                        </div>
                                    `
                                    : ""
                                }


                                ${urlLink}

                            </div>

                        </div>

                    `;

                }
            );


            // --------------------------------
            // 宿泊地
            // --------------------------------

            const stays =
                Array.from(
                    document.querySelectorAll(
                        ".stay-item"
                    )
                );


            const staysForDay =
                stays.filter(
                    function (stay) {

                        return (
                            stay.querySelector(
                                ".stay-date"
                            )?.value
                            ===
                            date
                        );

                    }
                );


            staysForDay.forEach(
                function (stay) {

                    const place =
                        stay.querySelector(
                            ".stay-place"
                        )?.value
                        || "";


                    if (!place.trim()) {
                        return;
                    }


                    html += `

                        <div class="stay-preview">

                            <div class="stay-icon">
                                🏨
                            </div>


                            <div class="stay-info">

                                <div class="stay-label">
                                    宿泊地
                                </div>


                                <div class="stay-place-preview">
                                    ${escapeHtml(
                                        place
                                    )}
                                </div>

                            </div>

                        </div>

                    `;

                }
            );


            html += `

                    </div>

                </div>

            `;

        }
    );


    if (!html) {

        html = `
            <p class="empty-message">
                行程を入力してください。
            </p>
        `;

    }


    return html;

}


// ========================================
// 費用プレビュー
// ========================================

function buildCostPreview() {

    const items =
        Array.from(
            document.querySelectorAll(
                ".cost-item"
            )
        );


    let total = 0;


    const categoryTotals = {

        "交通費": 0,

        "宿泊費": 0,

        "食費": 0,

        "観光費": 0,

        "その他": 0

    };


    const data = [];


    items.forEach(
        function (item) {

            const date =
                item.querySelector(
                    ".cost-date"
                )?.value
                || "";


            const category =
                item.querySelector(
                    ".cost-category"
                )?.value
                ||
                "その他";


            const name =
                item.querySelector(
                    ".cost-name"
                )?.value
                ||
                "未入力";


            const amount =
                Number(
                    item.querySelector(
                        ".cost-amount"
                    )?.value
                )
                || 0;


            total += amount;


            if (
                categoryTotals[
                    category
                ] !== undefined
            ) {

                categoryTotals[
                    category
                ] += amount;

            }


            data.push({

                date:
                    date,

                category:
                    category,

                name:
                    name,

                amount:
                    amount

            });

        }
    );


    data.sort(
        function (a, b) {

            const dateA =
                a.date
                ||
                "9999-12-31";


            const dateB =
                b.date
                ||
                "9999-12-31";


            return dateA.localeCompare(
                dateB
            );

        }
    );


    const groups = {};


    data.forEach(
        function (cost) {

            const date =
                cost.date
                ||
                "no-date";


            if (!groups[date]) {

                groups[date] = [];

            }


            groups[date].push(
                cost
            );

        }
    );


    let html = "";

    let dayNumber = 0;


    Object.keys(
        groups
    ).forEach(
        function (date) {

            dayNumber++;


            const dayTitle =
                date === "no-date"
                    ? "日付未設定"
                    : formatDate(date);


            html += `

                <div class="cost-day-section">

                    <div class="cost-day-header">

                        <span class="day-number">
                            ${dayNumber}日目
                        </span>


                        <span class="day-date">
                            ${dayTitle}
                        </span>

                    </div>

            `;


            groups[date].forEach(
                function (cost) {

                    html += `

                        <div class="cost-preview">

                            <div>

                                <div
                                    class="cost-category-preview"
                                >
                                    ${escapeHtml(
                                        cost.category
                                    )}
                                </div>


                                <div class="cost-name">
                                    ${escapeHtml(
                                        cost.name
                                    )}
                                </div>

                            </div>


                            <span>
                                ${formatYen(
                                    cost.amount
                                )}
                            </span>

                        </div>

                    `;

                }
            );


            html += `

                </div>

            `;

        }
    );


    if (
        items.length === 0
    ) {

        html = `
            <p class="empty-message">
                費用を追加してください。
            </p>
        `;

    }


    return {

        html:
            html,

        total:
            total,

        categoryTotals:
            categoryTotals

    };

}


// ========================================
// プレビュー更新
// ========================================

function updatePreview() {

    $("#previewTitle")
        .textContent =
        $("#tripTitle")?.value
        ||
        "旅行のしおり";


    const start =
        $("#startDate")?.value
        ||
        "";


    const end =
        $("#endDate")?.value
        ||
        "";


    if (start) {

        let text =
            formatDate(
                start
            );


        if (end) {

            text +=
                " ～ "
                +
                formatDate(
                    end
                );

        }


        $("#previewDate")
            .textContent =
            text;

    }
    else {

        $("#previewDate")
            .textContent =
            "日程を入力してください";

    }


    const participants =
        $("#participants")?.value
        ||
        "";


    $("#previewParticipants")
        .textContent =
        participants
            ? "参加者：" + participants
            : "";


    // ------------------------------------
    // 行程
    // ------------------------------------

    $("#previewSchedules")
        .innerHTML =
        buildSchedulePreview();


    // ------------------------------------
    // 費用
    // ------------------------------------

    const costResult =
        buildCostPreview();


    $("#previewCosts")
        .innerHTML =
        costResult.html;


    // ------------------------------------
    // カテゴリ別合計
    // ------------------------------------

    let categoryHTML =
        "";


    Object.keys(
        costResult.categoryTotals
    ).forEach(
        function (category) {

            const amount =
                costResult.categoryTotals[
                    category
                ];


            if (amount > 0) {

                categoryHTML += `

                    <div class="category-total">

                        <span>
                            ${category}
                        </span>


                        <span>
                            ${formatYen(
                                amount
                            )}
                        </span>

                    </div>

                `;

            }

        }
    );


    $("#previewCategoryTotals")
        .innerHTML =
        categoryHTML;


    // ------------------------------------
    // 総額
    // ------------------------------------

    $("#previewTotal")
        .textContent =
        formatYen(
            costResult.total
        );


    // ------------------------------------
    // メモ
    // ------------------------------------

    $("#previewMemo")
        .textContent =
        $("#memo")?.value
        ||
        "特になし";

}


// ========================================
// タイムライン → 地図
// ========================================

document.addEventListener(
    "click",
    function (event) {

        const timelineItem =
            event.target.closest(
                ".timeline-clickable"
            );


        if (!timelineItem) {
            return;
        }


        if (
            event.target.closest(
                ".schedule-url-link"
            )
        ) {

            return;

        }


        const scheduleId =
            timelineItem.dataset.scheduleId;


        const marker =
            markerMap.get(
                scheduleId
            );


        if (!marker) {
            return;
        }


        const mapElement =
            $("#map");


        if (mapElement) {

            mapElement.scrollIntoView({

                behavior:
                    "smooth",

                block:
                    "center"

            });

        }


        setTimeout(
            function () {

                if (!map) {
                    return;
                }


                map.setView(
                    marker.getLatLng(),
                    16,
                    {
                        animate:
                            true
                    }
                );


                marker.openPopup();

            },
            400
        );

    }
);


// ========================================
// 基本情報イベント
// ========================================

$("#tripTitle")
    ?.addEventListener(
        "input",
        updatePreview
    );


$("#startDate")
    ?.addEventListener(
        "input",
        function () {

            updateDateRange();

            updatePreview();

        }
    );


$("#startDate")
    ?.addEventListener(
        "change",
        function () {

            updateDateRange();

            updatePreview();

        }
    );


$("#endDate")
    ?.addEventListener(
        "input",
        function () {

            updateDateRange();

            updatePreview();

        }
    );


$("#endDate")
    ?.addEventListener(
        "change",
        function () {

            updateDateRange();

            updatePreview();

        }
    );


$("#participants")
    ?.addEventListener(
        "input",
        updatePreview
    );


$("#memo")
    ?.addEventListener(
        "input",
        updatePreview
    );


// ========================================
// ボタン
// ========================================

$("#addScheduleButton")
    ?.addEventListener(
        "click",
        addSchedule
    );


$("#addCostButton")
    ?.addEventListener(
        "click",
        addCost
    );


// ========================================
// 宿泊地ボタン
// ========================================

const addStayButton =
    $("#addStayButton");


if (addStayButton) {

    // 自動生成方式のため非表示

    addStayButton.style.display =
        "none";

}


// ========================================
// PDF
// ========================================

$("#pdfButton")
    ?.addEventListener(
        "click",
        function () {

            window.print();

        }
    );


// ========================================
// スマートフォン
// 編集 / しおり
// ========================================

const editViewButton =
    $("#editViewButton");


const shioriViewButton =
    $("#shioriViewButton");


function showEditView() {

    document.body.classList.remove(
        "shiori-mode"
    );


    document.body.classList.add(
        "edit-mode"
    );


    if (editViewButton) {

        editViewButton.classList.add(
            "active"
        );

    }


    if (shioriViewButton) {

        shioriViewButton.classList.remove(
            "active"
        );

    }

}


function showShioriView() {

    document.body.classList.remove(
        "edit-mode"
    );


    document.body.classList.add(
        "shiori-mode"
    );


    if (editViewButton) {

        editViewButton.classList.remove(
            "active"
        );

    }


    if (shioriViewButton) {

        shioriViewButton.classList.add(
            "active"
        );

    }


    setTimeout(
        function () {

            if (map) {

                map.invalidateSize();

            }

        },
        150
    );

}


if (
    editViewButton
    &&
    shioriViewButton
) {

    editViewButton.addEventListener(
        "click",
        showEditView
    );


    shioriViewButton.addEventListener(
        "click",
        showShioriView
    );

}


// ========================================
// 初期化
// ========================================

addSchedule();

addCost();

updateDateRange();

updateStayVisibility();

updatePreview();


// ========================================
// Leaflet
// ========================================

window.addEventListener(
    "load",
    function () {

        initializeMap();

    }
);


// ========================================
// スマートフォン初期表示
// ========================================

window.addEventListener(
    "load",
    function () {

        if (
            window.innerWidth <= 700
        ) {

            showShioriView();

        }

    }
);
