(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/Desktop/Instagram-lite/app/blog/create/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>CreateBlogPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Instagram-lite/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Instagram-lite/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Instagram-lite/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Instagram-lite/node_modules/next/image.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
function CreateBlogPage() {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const [caption, setCaption] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [image, setImage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [imagePreview, setImagePreview] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [dragActive, setDragActive] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isAuthenticated, setIsAuthenticated] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // Check login
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CreateBlogPage.useEffect": ()=>{
            const checkAuth = {
                "CreateBlogPage.useEffect.checkAuth": async ()=>{
                    try {
                        const res = await fetch('/api/me', {
                            credentials: 'include'
                        });
                        if (res.ok) {
                            setIsAuthenticated(true);
                        } else {
                            setIsAuthenticated(false);
                            router.push('/login');
                        }
                    } catch (e) {
                        setIsAuthenticated(false);
                        router.push('/login');
                    }
                }
            }["CreateBlogPage.useEffect.checkAuth"];
            checkAuth();
        }
    }["CreateBlogPage.useEffect"], [
        router
    ]);
    const handleImageChange = (file)=>{
        setImage(file);
        if (file) {
            const reader = new FileReader();
            reader.onload = (e)=>{
                var _e_target;
                setImagePreview((_e_target = e.target) === null || _e_target === void 0 ? void 0 : _e_target.result);
            };
            reader.readAsDataURL(file);
        } else {
            setImagePreview(null);
        }
    };
    const handleDragEvents = (e, type)=>{
        e.preventDefault();
        e.stopPropagation();
        if (type === 'in') setDragActive(true);
        if (type === 'out') setDragActive(false);
        if (type === 'drop') {
            setDragActive(false);
            if (e.dataTransfer.files[0]) {
                handleImageChange(e.dataTransfer.files[0]);
            }
        }
    };
    const handleSubmit = async (e)=>{
        e.preventDefault();
        setIsLoading(true);
        try {
            const formData = new FormData();
            formData.append('caption', caption);
            if (image) formData.append('image', image);
            const res = await fetch('/api/blog/create', {
                method: 'POST',
                body: formData,
                credentials: 'include'
            });
            if (res.ok) {
                router.push('/profile'); // Redirect to profile after successful post
            } else if (res.status === 401) {
                alert('Please login to continue.');
                router.push('/login');
            } else {
                const errorData = await res.json().catch(()=>({
                        error: 'Unknown error'
                    }));
                alert("Failed: ".concat(errorData.error));
            }
        } catch (error) {
            alert('Network error. Try again.');
        } finally{
            setIsLoading(false);
        }
    };
    if (isAuthenticated === null) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex justify-center items-center min-h-screen bg-gray-100",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                children: "Checking authentication..."
            }, void 0, false, {
                fileName: "[project]/Desktop/Instagram-lite/app/blog/create/page.tsx",
                lineNumber: 96,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/Desktop/Instagram-lite/app/blog/create/page.tsx",
            lineNumber: 95,
            columnNumber: 7
        }, this);
    }
    if (!isAuthenticated) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-gray-50",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "max-w-3xl mx-auto px-4 py-8",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                    className: "text-3xl font-bold text-purple-600 mb-6",
                    children: "Create New Post"
                }, void 0, false, {
                    fileName: "[project]/Desktop/Instagram-lite/app/blog/create/page.tsx",
                    lineNumber: 106,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                    onSubmit: handleSubmit,
                    className: "space-y-6",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "border-2 border-dashed rounded-xl p-6 text-center transition ".concat(dragActive ? 'border-purple-400 bg-purple-50' : 'border-gray-300'),
                            onDragEnter: (e)=>handleDragEvents(e, 'in'),
                            onDragLeave: (e)=>handleDragEvents(e, 'out'),
                            onDragOver: (e)=>handleDragEvents(e, 'over'),
                            onDrop: (e)=>handleDragEvents(e, 'drop'),
                            children: imagePreview ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "relative",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        src: imagePreview,
                                        alt: "Preview",
                                        width: 800,
                                        height: 600,
                                        className: "rounded-lg object-cover w-full max-h-80"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/Instagram-lite/app/blog/create/page.tsx",
                                        lineNumber: 121,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        onClick: ()=>handleImageChange(null),
                                        className: "absolute top-2 right-2 bg-red-500 text-white rounded-full p-2",
                                        children: "×"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/Instagram-lite/app/blog/create/page.tsx",
                                        lineNumber: 128,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/Instagram-lite/app/blog/create/page.tsx",
                                lineNumber: 120,
                                columnNumber: 15
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "mb-2",
                                        children: "Drag & drop an image, or"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/Instagram-lite/app/blog/create/page.tsx",
                                        lineNumber: 138,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "cursor-pointer inline-block bg-purple-600 text-white px-4 py-2 rounded",
                                        children: [
                                            "Choose Image",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "file",
                                                accept: "image/*",
                                                className: "hidden",
                                                onChange: (e)=>{
                                                    var _e_target_files;
                                                    return handleImageChange(((_e_target_files = e.target.files) === null || _e_target_files === void 0 ? void 0 : _e_target_files[0]) || null);
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/Instagram-lite/app/blog/create/page.tsx",
                                                lineNumber: 141,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Desktop/Instagram-lite/app/blog/create/page.tsx",
                                        lineNumber: 139,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/Instagram-lite/app/blog/create/page.tsx",
                                lineNumber: 137,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/Desktop/Instagram-lite/app/blog/create/page.tsx",
                            lineNumber: 110,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                    value: caption,
                                    onChange: (e)=>setCaption(e.target.value),
                                    rows: 4,
                                    maxLength: 500,
                                    placeholder: "Write your caption here...",
                                    className: "w-full border border-gray-300 rounded-xl p-4 resize-none"
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/Instagram-lite/app/blog/create/page.tsx",
                                    lineNumber: 154,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-sm text-gray-500 text-right",
                                    children: [
                                        caption.length,
                                        "/500"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Desktop/Instagram-lite/app/blog/create/page.tsx",
                                    lineNumber: 162,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Desktop/Instagram-lite/app/blog/create/page.tsx",
                            lineNumber: 153,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex justify-between items-center",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    onClick: ()=>router.back(),
                                    className: "px-4 py-2 border border-gray-300 rounded hover:bg-gray-100",
                                    children: "Cancel"
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/Instagram-lite/app/blog/create/page.tsx",
                                    lineNumber: 167,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "submit",
                                    disabled: !image || !caption.trim() || isLoading,
                                    className: "px-6 py-2 rounded text-white transition ".concat(!image || !caption.trim() || isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700'),
                                    children: isLoading ? 'Publishing...' : 'Publish'
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/Instagram-lite/app/blog/create/page.tsx",
                                    lineNumber: 174,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Desktop/Instagram-lite/app/blog/create/page.tsx",
                            lineNumber: 166,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Desktop/Instagram-lite/app/blog/create/page.tsx",
                    lineNumber: 108,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/Desktop/Instagram-lite/app/blog/create/page.tsx",
            lineNumber: 105,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/Desktop/Instagram-lite/app/blog/create/page.tsx",
        lineNumber: 104,
        columnNumber: 5
    }, this);
}
_s(CreateBlogPage, "F0jVkyczyiKhwhV0Di0TxPppDYM=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = CreateBlogPage;
var _c;
__turbopack_context__.k.register(_c, "CreateBlogPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=Desktop_Instagram-lite_app_blog_create_page_tsx_fdab231e._.js.map