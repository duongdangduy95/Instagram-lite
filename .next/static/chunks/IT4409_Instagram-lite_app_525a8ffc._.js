(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/IT4409/Instagram-lite/app/components/FollowButton.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>FollowButton
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/IT4409/Instagram-lite/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/IT4409/Instagram-lite/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
function FollowButton(param) {
    let { targetUserId, initialIsFollowing, onFollowChange } = param;
    _s();
    const [isFollowing, setIsFollowing] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(initialIsFollowing);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const handleFollow = async ()=>{
        setIsLoading(true);
        try {
            const response = await fetch("/api/follow/".concat(targetUserId), {
                method: isFollowing ? 'DELETE' : 'POST',
                credentials: 'include'
            });
            if (response.ok) {
                const data = await response.json();
                setIsFollowing(!isFollowing);
                onFollowChange === null || onFollowChange === void 0 ? void 0 : onFollowChange(!isFollowing, data.followersCount);
            } else {
                alert('Có lỗi xảy ra');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Có lỗi xảy ra');
        } finally{
            setIsLoading(false);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        onClick: handleFollow,
        disabled: isLoading,
        className: "px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 ".concat(isFollowing ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' : 'bg-blue-600 text-white hover:bg-blue-700'),
        children: isLoading ? '...' : isFollowing ? '✓ Đang theo dõi' : '+ Theo dõi'
    }, void 0, false, {
        fileName: "[project]/IT4409/Instagram-lite/app/components/FollowButton.tsx",
        lineNumber: 43,
        columnNumber: 5
    }, this);
}
_s(FollowButton, "eAsIeDy8/Xfpg5TeO3gTcEFTOHk=");
_c = FollowButton;
var _c;
__turbopack_context__.k.register(_c, "FollowButton");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/IT4409/Instagram-lite/app/components/Navigation.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Navigation
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/IT4409/Instagram-lite/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/IT4409/Instagram-lite/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2d$auth$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/IT4409/Instagram-lite/node_modules/next-auth/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/IT4409/Instagram-lite/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
function Navigation() {
    _s();
    const { data: session } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2d$auth$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSession"])();
    const [showMenu, setShowMenu] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
        className: "bg-white shadow-sm border-b sticky top-0 z-50",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "max-w-7xl mx-auto px-4 py-3",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center justify-between",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            href: "/",
                            className: "text-2xl font-bold text-blue-600 hover:text-blue-700",
                            children: "InstaClone"
                        }, void 0, false, {
                            fileName: "[project]/IT4409/Instagram-lite/app/components/Navigation.tsx",
                            lineNumber: 16,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "hidden md:flex items-center space-x-6",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    href: "/home",
                                    className: "flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-xl",
                                            children: "🏠"
                                        }, void 0, false, {
                                            fileName: "[project]/IT4409/Instagram-lite/app/components/Navigation.tsx",
                                            lineNumber: 26,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: "Trang chủ"
                                        }, void 0, false, {
                                            fileName: "[project]/IT4409/Instagram-lite/app/components/Navigation.tsx",
                                            lineNumber: 27,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/IT4409/Instagram-lite/app/components/Navigation.tsx",
                                    lineNumber: 22,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    href: "/search",
                                    className: "flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-xl",
                                            children: "🔍"
                                        }, void 0, false, {
                                            fileName: "[project]/IT4409/Instagram-lite/app/components/Navigation.tsx",
                                            lineNumber: 34,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: "Tìm kiếm"
                                        }, void 0, false, {
                                            fileName: "[project]/IT4409/Instagram-lite/app/components/Navigation.tsx",
                                            lineNumber: 35,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/IT4409/Instagram-lite/app/components/Navigation.tsx",
                                    lineNumber: 30,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    href: "/blog/create",
                                    className: "flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-xl",
                                            children: "➕"
                                        }, void 0, false, {
                                            fileName: "[project]/IT4409/Instagram-lite/app/components/Navigation.tsx",
                                            lineNumber: 42,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: "Tạo bài"
                                        }, void 0, false, {
                                            fileName: "[project]/IT4409/Instagram-lite/app/components/Navigation.tsx",
                                            lineNumber: 43,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/IT4409/Instagram-lite/app/components/Navigation.tsx",
                                    lineNumber: 38,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    href: "/profile",
                                    className: "flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-xl",
                                            children: "👤"
                                        }, void 0, false, {
                                            fileName: "[project]/IT4409/Instagram-lite/app/components/Navigation.tsx",
                                            lineNumber: 50,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: "Trang cá nhân"
                                        }, void 0, false, {
                                            fileName: "[project]/IT4409/Instagram-lite/app/components/Navigation.tsx",
                                            lineNumber: 51,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/IT4409/Instagram-lite/app/components/Navigation.tsx",
                                    lineNumber: 46,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2d$auth$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["signOut"])({
                                            redirect: true,
                                            callbackUrl: '/login'
                                        }),
                                    className: "flex items-center space-x-2 text-gray-700 hover:text-red-600 transition-colors",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-xl",
                                            children: "🚪"
                                        }, void 0, false, {
                                            fileName: "[project]/IT4409/Instagram-lite/app/components/Navigation.tsx",
                                            lineNumber: 58,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: "Đăng xuất"
                                        }, void 0, false, {
                                            fileName: "[project]/IT4409/Instagram-lite/app/components/Navigation.tsx",
                                            lineNumber: 59,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/IT4409/Instagram-lite/app/components/Navigation.tsx",
                                    lineNumber: 54,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/IT4409/Instagram-lite/app/components/Navigation.tsx",
                            lineNumber: 21,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>setShowMenu(!showMenu),
                            className: "md:hidden text-2xl focus:outline-none",
                            children: "☰"
                        }, void 0, false, {
                            fileName: "[project]/IT4409/Instagram-lite/app/components/Navigation.tsx",
                            lineNumber: 64,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/IT4409/Instagram-lite/app/components/Navigation.tsx",
                    lineNumber: 14,
                    columnNumber: 9
                }, this),
                showMenu && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "md:hidden mt-4 pb-4 space-y-3 border-t pt-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            href: "/home",
                            className: "block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors",
                            onClick: ()=>setShowMenu(false),
                            children: "🏠 Trang chủ"
                        }, void 0, false, {
                            fileName: "[project]/IT4409/Instagram-lite/app/components/Navigation.tsx",
                            lineNumber: 75,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            href: "/search",
                            className: "block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors",
                            onClick: ()=>setShowMenu(false),
                            children: "🔍 Tìm kiếm"
                        }, void 0, false, {
                            fileName: "[project]/IT4409/Instagram-lite/app/components/Navigation.tsx",
                            lineNumber: 83,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            href: "/blog/create",
                            className: "block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors",
                            onClick: ()=>setShowMenu(false),
                            children: "➕ Tạo bài"
                        }, void 0, false, {
                            fileName: "[project]/IT4409/Instagram-lite/app/components/Navigation.tsx",
                            lineNumber: 91,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            href: "/profile",
                            className: "block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors",
                            onClick: ()=>setShowMenu(false),
                            children: "👤 Trang cá nhân"
                        }, void 0, false, {
                            fileName: "[project]/IT4409/Instagram-lite/app/components/Navigation.tsx",
                            lineNumber: 99,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>{
                                (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2d$auth$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["signOut"])({
                                    redirect: true,
                                    callbackUrl: '/login'
                                });
                                setShowMenu(false);
                            },
                            className: "block w-full text-left px-4 py-2 text-gray-700 hover:bg-red-50 rounded-lg transition-colors",
                            children: "🚪 Đăng xuất"
                        }, void 0, false, {
                            fileName: "[project]/IT4409/Instagram-lite/app/components/Navigation.tsx",
                            lineNumber: 107,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/IT4409/Instagram-lite/app/components/Navigation.tsx",
                    lineNumber: 74,
                    columnNumber: 11
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/IT4409/Instagram-lite/app/components/Navigation.tsx",
            lineNumber: 13,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/IT4409/Instagram-lite/app/components/Navigation.tsx",
        lineNumber: 12,
        columnNumber: 5
    }, this);
}
_s(Navigation, "iE/CEspgnHKsqrWJOeGEsM90pJw=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2d$auth$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSession"]
    ];
});
_c = Navigation;
var _c;
__turbopack_context__.k.register(_c, "Navigation");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/IT4409/Instagram-lite/app/components/LikeButton.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>LikeButton
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/IT4409/Instagram-lite/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/IT4409/Instagram-lite/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/IT4409/Instagram-lite/node_modules/next/navigation.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
function LikeButton(param) {
    let { blogId, initialLiked = false, initialCount = 0, onLikeChange } = param;
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const [liked, setLiked] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(initialLiked);
    const [likeCount, setLikeCount] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(initialCount);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [authenticated, setAuthenticated] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // gọi API /api/me
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "LikeButton.useEffect": ()=>{
            const checkSession = {
                "LikeButton.useEffect.checkSession": async ()=>{
                    try {
                        const res = await fetch('/api/me', {
                            method: 'GET',
                            credentials: 'include'
                        });
                        if (!res.ok) {
                            console.log('Không có session, chuyển hướng đến /login');
                            setAuthenticated(false);
                            return;
                        }
                        const data = await res.json();
                        console.log('User session found:', data);
                        setAuthenticated(true);
                    } catch (err) {
                        console.error('Lỗi kiểm tra session:', err);
                        setAuthenticated(false);
                    }
                }
            }["LikeButton.useEffect.checkSession"];
            checkSession();
        }
    }["LikeButton.useEffect"], []);
    const handleLike = async ()=>{
        if (authenticated === null) {
            console.log('Đang kiểm tra session...');
            return;
        }
        if (!authenticated) {
            console.log('Không có session, chuyển hướng đến /login');
            router.push('/login');
            return;
        }
        setLoading(true);
        try {
            console.log('Sending like request for blog:', blogId);
            const response = await fetch("/api/blog/".concat(blogId, "/like"), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });
            console.log('Response status:', response.status);
            if (!response.ok) {
                const errorData = await response.text();
                console.error('Server error:', errorData);
                throw new Error("HTTP ".concat(response.status, ": ").concat(errorData));
            }
            const data = await response.json();
            console.log('Like response:', data);
            setLiked(data.liked);
            const newCount = data.liked ? likeCount + 1 : likeCount - 1;
            setLikeCount(newCount);
            // Gọi callback để update parent component
            if (onLikeChange) {
                onLikeChange(newCount);
            }
        } catch (error) {
            console.error('Like error:', error);
            if (error instanceof Error && error.message.includes('401')) {
                console.log('Session invalid, redirecting to login');
                router.push('/login');
            }
        } finally{
            setLoading(false);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        onClick: handleLike,
        disabled: loading || authenticated === null,
        className: "flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors flex-1 justify-center ".concat(loading || authenticated === null ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: liked ? 'text-blue-500' : 'text-gray-600',
                children: "👍"
            }, void 0, false, {
                fileName: "[project]/IT4409/Instagram-lite/app/components/LikeButton.tsx",
                lineNumber: 117,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "font-medium ".concat(liked ? 'text-blue-600' : 'text-gray-600'),
                children: loading ? 'Đang xử lý...' : liked ? 'Đã thích' : 'Thích'
            }, void 0, false, {
                fileName: "[project]/IT4409/Instagram-lite/app/components/LikeButton.tsx",
                lineNumber: 120,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/IT4409/Instagram-lite/app/components/LikeButton.tsx",
        lineNumber: 108,
        columnNumber: 5
    }, this);
}
_s(LikeButton, "5vgOyih5SVWg4/KQWozaNX35hCQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = LikeButton;
var _c;
__turbopack_context__.k.register(_c, "LikeButton");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/IT4409/Instagram-lite/app/components/CommentSection.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>CommentSection
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/IT4409/Instagram-lite/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/IT4409/Instagram-lite/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/IT4409/Instagram-lite/node_modules/axios/lib/axios.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
function buildCommentTree(comments) {
    const map = new Map();
    const roots = [];
    comments.forEach((comment)=>{
        map.set(comment.id, {
            ...comment,
            replies: []
        });
    });
    map.forEach((comment)=>{
        if (comment.parentId) {
            const parent = map.get(comment.parentId);
            parent === null || parent === void 0 ? void 0 : parent.replies.push(comment);
        } else {
            roots.push(comment);
        }
    });
    return roots;
}
function CommentSection(param) {
    let { blogId, currentUser, onCommentAdded, onClose } = param;
    _s();
    const [comments, setComments] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [newComment, setNewComment] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [replyTo, setReplyTo] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CommentSection.useEffect": ()=>{
            __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get("/api/blog/".concat(blogId, "/comment"), {
                withCredentials: true
            }).then({
                "CommentSection.useEffect": (res)=>{
                    const tree = buildCommentTree(res.data);
                    setComments(tree);
                }
            }["CommentSection.useEffect"]).catch({
                "CommentSection.useEffect": (err)=>{
                    console.error('Error loading comments:', err);
                }
            }["CommentSection.useEffect"]);
        }
    }["CommentSection.useEffect"], [
        blogId
    ]);
    async function handleSubmit(e) {
        e.preventDefault();
        if (!newComment.trim()) return;
        try {
            await __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post("/api/blog/".concat(blogId, "/comment"), {
                content: newComment,
                parentId: replyTo
            }, {
                withCredentials: true
            });
            setNewComment('');
            setReplyTo(null);
            const res = await __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get("/api/blog/".concat(blogId, "/comment"), {
                withCredentials: true
            });
            setComments(buildCommentTree(res.data));
            // Gọi callback để cập nhật số lượng bình luận
            if (onCommentAdded) {
                onCommentAdded();
            }
        } catch (err) {
            console.error('Error submitting comment:', err);
            alert('Không thể gửi bình luận. Vui lòng thử lại.');
        }
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex flex-col h-full",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex justify-between items-center p-4 border-b bg-gray-50",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "text-lg font-semibold",
                        children: "Bình luận"
                    }, void 0, false, {
                        fileName: "[project]/IT4409/Instagram-lite/app/components/CommentSection.tsx",
                        lineNumber: 99,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: onClose,
                        className: "text-red-500 text-xl font-bold hover:text-red-600",
                        children: "✕"
                    }, void 0, false, {
                        fileName: "[project]/IT4409/Instagram-lite/app/components/CommentSection.tsx",
                        lineNumber: 100,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/IT4409/Instagram-lite/app/components/CommentSection.tsx",
                lineNumber: 98,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-1 p-4 overflow-y-auto",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-3",
                    children: comments.map((comment)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CommentItem, {
                            comment: comment,
                            currentUser: currentUser,
                            onReply: setReplyTo
                        }, comment.id, false, {
                            fileName: "[project]/IT4409/Instagram-lite/app/components/CommentSection.tsx",
                            lineNumber: 112,
                            columnNumber: 13
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/IT4409/Instagram-lite/app/components/CommentSection.tsx",
                    lineNumber: 110,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/IT4409/Instagram-lite/app/components/CommentSection.tsx",
                lineNumber: 109,
                columnNumber: 7
            }, this),
            currentUser && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "border-t bg-white p-4",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                    onSubmit: handleSubmit,
                    children: [
                        replyTo && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-sm text-blue-500 mb-2",
                            children: [
                                "Trả lời một bình luận.",
                                ' ',
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>setReplyTo(null),
                                    type: "button",
                                    className: "text-red-500 underline ml-2",
                                    children: "Huỷ"
                                }, void 0, false, {
                                    fileName: "[project]/IT4409/Instagram-lite/app/components/CommentSection.tsx",
                                    lineNumber: 129,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/IT4409/Instagram-lite/app/components/CommentSection.tsx",
                            lineNumber: 127,
                            columnNumber: 15
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                            value: newComment,
                            onChange: (e)=>setNewComment(e.target.value),
                            rows: 2,
                            placeholder: "Viết bình luận...",
                            className: "w-full border rounded p-2 focus:outline-none focus:ring focus:ring-blue-300"
                        }, void 0, false, {
                            fileName: "[project]/IT4409/Instagram-lite/app/components/CommentSection.tsx",
                            lineNumber: 138,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "submit",
                            className: "mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600",
                            children: "Gửi"
                        }, void 0, false, {
                            fileName: "[project]/IT4409/Instagram-lite/app/components/CommentSection.tsx",
                            lineNumber: 145,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/IT4409/Instagram-lite/app/components/CommentSection.tsx",
                    lineNumber: 125,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/IT4409/Instagram-lite/app/components/CommentSection.tsx",
                lineNumber: 124,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/IT4409/Instagram-lite/app/components/CommentSection.tsx",
        lineNumber: 96,
        columnNumber: 5
    }, this);
}
_s(CommentSection, "4uUlMy3FPjKI1efV1DOGYSg5Hjs=");
_c = CommentSection;
function CommentItem(param) {
    let { comment, currentUser, onReply } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "ml-2 mt-2",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "p-2 bg-gray-100 rounded-lg border border-gray-200",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm font-medium text-gray-800",
                        children: [
                            comment.author.fullname,
                            ' ',
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-gray-500 text-xs",
                                children: new Date(comment.createdAt).toLocaleString()
                            }, void 0, false, {
                                fileName: "[project]/IT4409/Instagram-lite/app/components/CommentSection.tsx",
                                lineNumber: 170,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/IT4409/Instagram-lite/app/components/CommentSection.tsx",
                        lineNumber: 168,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm text-gray-700",
                        children: comment.content
                    }, void 0, false, {
                        fileName: "[project]/IT4409/Instagram-lite/app/components/CommentSection.tsx",
                        lineNumber: 174,
                        columnNumber: 9
                    }, this),
                    currentUser && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>onReply(comment.id),
                        className: "text-xs text-blue-500 hover:underline mt-1",
                        children: "Trả lời"
                    }, void 0, false, {
                        fileName: "[project]/IT4409/Instagram-lite/app/components/CommentSection.tsx",
                        lineNumber: 176,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/IT4409/Instagram-lite/app/components/CommentSection.tsx",
                lineNumber: 167,
                columnNumber: 7
            }, this),
            comment.replies.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "ml-4 border-l pl-2 mt-2",
                children: comment.replies.map((reply)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CommentItem, {
                        comment: reply,
                        currentUser: currentUser,
                        onReply: onReply
                    }, reply.id, false, {
                        fileName: "[project]/IT4409/Instagram-lite/app/components/CommentSection.tsx",
                        lineNumber: 189,
                        columnNumber: 13
                    }, this))
            }, void 0, false, {
                fileName: "[project]/IT4409/Instagram-lite/app/components/CommentSection.tsx",
                lineNumber: 187,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/IT4409/Instagram-lite/app/components/CommentSection.tsx",
        lineNumber: 166,
        columnNumber: 5
    }, this);
}
_c1 = CommentItem;
var _c, _c1;
__turbopack_context__.k.register(_c, "CommentSection");
__turbopack_context__.k.register(_c1, "CommentItem");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/IT4409/Instagram-lite/app/components/CommentToggle.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>CommentToggle
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/IT4409/Instagram-lite/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/IT4409/Instagram-lite/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$app$2f$components$2f$CommentSection$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/IT4409/Instagram-lite/app/components/CommentSection.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
function CommentToggle(param) {
    let { blogId, currentUser, onCommentAdded, onClose, isOpen } = param;
    _s();
    const [internalOpen, setInternalOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const showComments = isOpen !== undefined ? isOpen : internalOpen;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CommentToggle.useEffect": ()=>{
            if (showComments) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = 'unset';
            }
            return ({
                "CommentToggle.useEffect": ()=>{
                    document.body.style.overflow = 'unset';
                }
            })["CommentToggle.useEffect"];
        }
    }["CommentToggle.useEffect"], [
        showComments
    ]);
    const handleToggle = ()=>{
        if (isOpen !== undefined && onClose) {
            onClose();
        } else {
            setInternalOpen(!internalOpen);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: handleToggle,
                className: "flex items-center space-x-2 px-4 py-2 hover:bg-gray-50 rounded-lg flex-1 justify-center transition-colors w-full",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-gray-600",
                        children: "💬"
                    }, void 0, false, {
                        fileName: "[project]/IT4409/Instagram-lite/app/components/CommentToggle.tsx",
                        lineNumber: 47,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-gray-600 font-medium",
                        children: "Bình luận"
                    }, void 0, false, {
                        fileName: "[project]/IT4409/Instagram-lite/app/components/CommentToggle.tsx",
                        lineNumber: 48,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/IT4409/Instagram-lite/app/components/CommentToggle.tsx",
                lineNumber: 43,
                columnNumber: 7
            }, this),
            showComments && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4",
                    onClick: handleToggle,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-white rounded-lg shadow-2xl w-full max-w-2xl h-[80vh] flex flex-col overflow-hidden",
                        onClick: (e)=>e.stopPropagation(),
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$app$2f$components$2f$CommentSection$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            blogId: blogId,
                            currentUser: currentUser,
                            onCommentAdded: onCommentAdded,
                            onClose: handleToggle
                        }, void 0, false, {
                            fileName: "[project]/IT4409/Instagram-lite/app/components/CommentToggle.tsx",
                            lineNumber: 63,
                            columnNumber: 15
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/IT4409/Instagram-lite/app/components/CommentToggle.tsx",
                        lineNumber: 59,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/IT4409/Instagram-lite/app/components/CommentToggle.tsx",
                    lineNumber: 54,
                    columnNumber: 11
                }, this)
            }, void 0, false)
        ]
    }, void 0, true);
}
_s(CommentToggle, "jVsCmjdQSS4eg3uu5zfhfNEWtmE=");
_c = CommentToggle;
var _c;
__turbopack_context__.k.register(_c, "CommentToggle");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/IT4409/Instagram-lite/app/components/ShareButton.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ShareButton
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/IT4409/Instagram-lite/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/IT4409/Instagram-lite/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
function ShareButton(param) {
    let { blogId, onShared } = param;
    _s();
    const [open, setOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [caption, setCaption] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const handleShare = async ()=>{
        setLoading(true);
        try {
            await fetch('/api/blog/share', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    blogId,
                    caption
                })
            });
            onShared === null || onShared === void 0 ? void 0 : onShared(); // gọi callback để refresh dữ liệu
            setOpen(false);
            setCaption('');
        } catch (error) {
            console.error('Error sharing blog:', error);
            alert('Chia sẻ bài viết thất bại.');
        } finally{
            setLoading(false);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: ()=>setOpen(true),
                className: "flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 rounded-lg flex-1 justify-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: "📤"
                    }, void 0, false, {
                        fileName: "[project]/IT4409/Instagram-lite/app/components/ShareButton.tsx",
                        lineNumber: 42,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "font-medium",
                        children: "Chia sẻ"
                    }, void 0, false, {
                        fileName: "[project]/IT4409/Instagram-lite/app/components/ShareButton.tsx",
                        lineNumber: 43,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/IT4409/Instagram-lite/app/components/ShareButton.tsx",
                lineNumber: 38,
                columnNumber: 7
            }, this),
            open && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 bg-black/40 flex items-center justify-center z-50",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-white rounded-lg p-4 w-full max-w-md",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                            className: "font-semibold mb-2",
                            children: "Chia sẻ bài viết"
                        }, void 0, false, {
                            fileName: "[project]/IT4409/Instagram-lite/app/components/ShareButton.tsx",
                            lineNumber: 49,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                            value: caption,
                            onChange: (e)=>setCaption(e.target.value),
                            placeholder: "Viết cảm nghĩ của bạn...",
                            className: "w-full border rounded p-2 mb-3",
                            rows: 3
                        }, void 0, false, {
                            fileName: "[project]/IT4409/Instagram-lite/app/components/ShareButton.tsx",
                            lineNumber: 50,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex justify-end space-x-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>setOpen(false),
                                    children: "Hủy"
                                }, void 0, false, {
                                    fileName: "[project]/IT4409/Instagram-lite/app/components/ShareButton.tsx",
                                    lineNumber: 58,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: handleShare,
                                    disabled: loading,
                                    className: "bg-blue-600 text-white px-4 py-1 rounded",
                                    children: loading ? 'Đang chia sẻ...' : 'Chia sẻ'
                                }, void 0, false, {
                                    fileName: "[project]/IT4409/Instagram-lite/app/components/ShareButton.tsx",
                                    lineNumber: 59,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/IT4409/Instagram-lite/app/components/ShareButton.tsx",
                            lineNumber: 57,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/IT4409/Instagram-lite/app/components/ShareButton.tsx",
                    lineNumber: 48,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/IT4409/Instagram-lite/app/components/ShareButton.tsx",
                lineNumber: 47,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true);
}
_s(ShareButton, "0+BvQENZ9FQik5+JaYPJa6NDTPI=");
_c = ShareButton;
var _c;
__turbopack_context__.k.register(_c, "ShareButton");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/IT4409/Instagram-lite/app/components/BlogActions.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>BlogActions
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/IT4409/Instagram-lite/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/IT4409/Instagram-lite/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$app$2f$components$2f$LikeButton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/IT4409/Instagram-lite/app/components/LikeButton.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$app$2f$components$2f$CommentToggle$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/IT4409/Instagram-lite/app/components/CommentToggle.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$app$2f$components$2f$ShareButton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/IT4409/Instagram-lite/app/components/ShareButton.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
function BlogActions(param) {
    let { blogId, displayBlogId, initialLikeCount, initialCommentCount, initialLiked, currentUser } = param;
    _s();
    const [likeCount, setLikeCount] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(initialLikeCount);
    const [commentCount, setCommentCount] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(initialCommentCount);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "px-4 pb-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex justify-between text-sm text-gray-500 mb-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: [
                            likeCount,
                            " lượt thích"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/IT4409/Instagram-lite/app/components/BlogActions.tsx",
                        lineNumber: 35,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: [
                            commentCount,
                            " bình luận"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/IT4409/Instagram-lite/app/components/BlogActions.tsx",
                        lineNumber: 36,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/IT4409/Instagram-lite/app/components/BlogActions.tsx",
                lineNumber: 34,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex space-x-4 border-t pt-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$app$2f$components$2f$LikeButton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        blogId: blogId,
                        initialLiked: initialLiked,
                        initialCount: initialLikeCount,
                        onLikeChange: (newCount)=>setLikeCount(newCount)
                    }, void 0, false, {
                        fileName: "[project]/IT4409/Instagram-lite/app/components/BlogActions.tsx",
                        lineNumber: 40,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$app$2f$components$2f$CommentToggle$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        blogId: blogId,
                        currentUser: currentUser,
                        onCommentAdded: ()=>setCommentCount((prev)=>prev + 1)
                    }, void 0, false, {
                        fileName: "[project]/IT4409/Instagram-lite/app/components/BlogActions.tsx",
                        lineNumber: 47,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$app$2f$components$2f$ShareButton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        blogId: displayBlogId
                    }, void 0, false, {
                        fileName: "[project]/IT4409/Instagram-lite/app/components/BlogActions.tsx",
                        lineNumber: 53,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/IT4409/Instagram-lite/app/components/BlogActions.tsx",
                lineNumber: 39,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/IT4409/Instagram-lite/app/components/BlogActions.tsx",
        lineNumber: 33,
        columnNumber: 5
    }, this);
}
_s(BlogActions, "pjPuvfoH1w3tQ/MyJNZmmm8n4pE=");
_c = BlogActions;
var _c;
__turbopack_context__.k.register(_c, "BlogActions");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/IT4409/Instagram-lite/app/home/carousel.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// app/home/Carousel.tsx
__turbopack_context__.s([
    "default",
    ()=>Carousel
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/IT4409/Instagram-lite/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/IT4409/Instagram-lite/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/IT4409/Instagram-lite/node_modules/next/image.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
function Carousel(param) {
    let { images, initialIndex = 0, onClose } = param;
    _s();
    const [index, setIndex] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(initialIndex);
    if (!images.length) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                className: "absolute top-4 right-4 text-white text-3xl",
                onClick: onClose,
                children: "×"
            }, void 0, false, {
                fileName: "[project]/IT4409/Instagram-lite/app/home/carousel.tsx",
                lineNumber: 20,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                className: "absolute left-4 text-white text-3xl",
                onClick: ()=>setIndex((prev)=>(prev - 1 + images.length) % images.length),
                children: "◀"
            }, void 0, false, {
                fileName: "[project]/IT4409/Instagram-lite/app/home/carousel.tsx",
                lineNumber: 26,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                className: "absolute right-4 text-white text-3xl",
                onClick: ()=>setIndex((prev)=>(prev + 1) % images.length),
                children: "▶"
            }, void 0, false, {
                fileName: "[project]/IT4409/Instagram-lite/app/home/carousel.tsx",
                lineNumber: 32,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative w-3/4 h-3/4",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    src: images[index],
                    alt: "carousel ".concat(index),
                    fill: true,
                    className: "object-contain"
                }, void 0, false, {
                    fileName: "[project]/IT4409/Instagram-lite/app/home/carousel.tsx",
                    lineNumber: 39,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/IT4409/Instagram-lite/app/home/carousel.tsx",
                lineNumber: 38,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/IT4409/Instagram-lite/app/home/carousel.tsx",
        lineNumber: 19,
        columnNumber: 5
    }, this);
}
_s(Carousel, "OEtXAK2bzkxxjcc1jvhfwDUKEw0=");
_c = Carousel;
var _c;
__turbopack_context__.k.register(_c, "Carousel");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=IT4409_Instagram-lite_app_525a8ffc._.js.map