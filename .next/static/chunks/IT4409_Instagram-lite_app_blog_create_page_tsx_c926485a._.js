(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/IT4409/Instagram-lite/app/blog/create/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>CreateBlogPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/IT4409/Instagram-lite/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/IT4409/Instagram-lite/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/IT4409/Instagram-lite/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/IT4409/Instagram-lite/node_modules/next/image.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
function CreateBlogPage() {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const [caption, setCaption] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [files, setFiles] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [filePreviews, setFilePreviews] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [dragActive, setDragActive] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isAuthenticated, setIsAuthenticated] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // Check login
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
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
    // Handle file selection
    const handleFileChange = (filesList)=>{
        if (!filesList) return;
        const newFiles = Array.from(filesList);
        setFiles((prev)=>[
                ...prev,
                ...newFiles
            ]);
        const newPreviews = newFiles.map((file)=>URL.createObjectURL(file));
        setFilePreviews((prev)=>[
                ...prev,
                ...newPreviews
            ]);
    };
    const removeFile = (index)=>{
        setFiles((prev)=>prev.filter((_, i)=>i !== index));
        setFilePreviews((prev)=>prev.filter((_, i)=>i !== index));
    };
    // Drag & drop
    const handleDragEvents = (e, type)=>{
        e.preventDefault();
        e.stopPropagation();
        if (type === 'in') setDragActive(true);
        if (type === 'out') setDragActive(false);
        if (type === 'drop') {
            setDragActive(false);
            if (e.dataTransfer.files.length) {
                handleFileChange(e.dataTransfer.files);
            }
        }
    };
    // Submit blog
    const handleSubmit = async (e)=>{
        e.preventDefault();
        if (!files.length || !caption.trim()) return;
        setIsLoading(true);
        try {
            const formData = new FormData();
            formData.append('caption', caption);
            files.forEach((file)=>formData.append(file.type.startsWith('video') ? 'videos' : 'images', file));
            const res = await fetch('/api/blog/create', {
                method: 'POST',
                body: formData,
                credentials: 'include'
            });
            if (res.ok) {
                router.push('/profile');
            } else if (res.status === 401) {
                alert('Please login to continue.');
                router.push('/login');
            } else {
                const errorData = await res.json().catch(()=>({
                        error: 'Unknown error'
                    }));
                alert("Failed: ".concat(errorData.error));
            }
        } catch (e) {
            alert('Network error. Try again.');
        } finally{
            setIsLoading(false);
        }
    };
    if (isAuthenticated === null) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex justify-center items-center min-h-screen bg-gray-100",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                children: "Checking authentication..."
            }, void 0, false, {
                fileName: "[project]/IT4409/Instagram-lite/app/blog/create/page.tsx",
                lineNumber: 103,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/IT4409/Instagram-lite/app/blog/create/page.tsx",
            lineNumber: 102,
            columnNumber: 7
        }, this);
    }
    if (!isAuthenticated) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-gray-50",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "max-w-3xl mx-auto px-4 py-8",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                    className: "text-3xl font-bold text-purple-600 mb-6",
                    children: "Create New Post"
                }, void 0, false, {
                    fileName: "[project]/IT4409/Instagram-lite/app/blog/create/page.tsx",
                    lineNumber: 113,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                    onSubmit: handleSubmit,
                    className: "space-y-6",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "border-2 border-dashed rounded-xl p-6 text-center transition ".concat(dragActive ? 'border-purple-400 bg-purple-50' : 'border-gray-300'),
                            onDragEnter: (e)=>handleDragEvents(e, 'in'),
                            onDragLeave: (e)=>handleDragEvents(e, 'out'),
                            onDragOver: (e)=>handleDragEvents(e, 'over'),
                            onDrop: (e)=>handleDragEvents(e, 'drop'),
                            children: filePreviews.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-wrap gap-4 justify-center",
                                children: filePreviews.map((preview, idx)=>{
                                    const isVideo = files[idx].type.startsWith('video');
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "relative",
                                        children: [
                                            isVideo ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("video", {
                                                src: preview,
                                                className: "rounded-lg object-cover w-40 h-40",
                                                muted: true,
                                                preload: "metadata"
                                            }, void 0, false, {
                                                fileName: "[project]/IT4409/Instagram-lite/app/blog/create/page.tsx",
                                                lineNumber: 133,
                                                columnNumber: 25
                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                src: preview,
                                                alt: "Preview ".concat(idx),
                                                width: 160,
                                                height: 160,
                                                className: "rounded-lg object-cover"
                                            }, void 0, false, {
                                                fileName: "[project]/IT4409/Instagram-lite/app/blog/create/page.tsx",
                                                lineNumber: 140,
                                                columnNumber: 25
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                type: "button",
                                                onClick: ()=>removeFile(idx),
                                                className: "absolute top-1 right-1 bg-red-500 text-white rounded-full p-1",
                                                children: "×"
                                            }, void 0, false, {
                                                fileName: "[project]/IT4409/Instagram-lite/app/blog/create/page.tsx",
                                                lineNumber: 148,
                                                columnNumber: 23
                                            }, this)
                                        ]
                                    }, idx, true, {
                                        fileName: "[project]/IT4409/Instagram-lite/app/blog/create/page.tsx",
                                        lineNumber: 131,
                                        columnNumber: 21
                                    }, this);
                                })
                            }, void 0, false, {
                                fileName: "[project]/IT4409/Instagram-lite/app/blog/create/page.tsx",
                                lineNumber: 127,
                                columnNumber: 15
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "mb-2",
                                        children: "Drag & drop images/videos, or"
                                    }, void 0, false, {
                                        fileName: "[project]/IT4409/Instagram-lite/app/blog/create/page.tsx",
                                        lineNumber: 161,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "cursor-pointer inline-block bg-purple-600 text-white px-4 py-2 rounded",
                                        children: [
                                            "Choose Files",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "file",
                                                accept: "image/*,video/*",
                                                multiple: true,
                                                className: "hidden",
                                                onChange: (e)=>handleFileChange(e.target.files)
                                            }, void 0, false, {
                                                fileName: "[project]/IT4409/Instagram-lite/app/blog/create/page.tsx",
                                                lineNumber: 164,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/IT4409/Instagram-lite/app/blog/create/page.tsx",
                                        lineNumber: 162,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/IT4409/Instagram-lite/app/blog/create/page.tsx",
                                lineNumber: 160,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/IT4409/Instagram-lite/app/blog/create/page.tsx",
                            lineNumber: 117,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                    value: caption,
                                    onChange: (e)=>setCaption(e.target.value),
                                    rows: 4,
                                    maxLength: 500,
                                    placeholder: "Write your caption here...",
                                    className: "w-full border border-gray-300 rounded-xl p-4 resize-none"
                                }, void 0, false, {
                                    fileName: "[project]/IT4409/Instagram-lite/app/blog/create/page.tsx",
                                    lineNumber: 178,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-sm text-gray-500 text-right",
                                    children: [
                                        caption.length,
                                        "/500"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/IT4409/Instagram-lite/app/blog/create/page.tsx",
                                    lineNumber: 186,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/IT4409/Instagram-lite/app/blog/create/page.tsx",
                            lineNumber: 177,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex justify-between items-center",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    onClick: ()=>router.back(),
                                    className: "px-4 py-2 border border-gray-300 rounded hover:bg-gray-100",
                                    children: "Cancel"
                                }, void 0, false, {
                                    fileName: "[project]/IT4409/Instagram-lite/app/blog/create/page.tsx",
                                    lineNumber: 191,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "submit",
                                    disabled: !files.length || !caption.trim() || isLoading,
                                    className: "px-6 py-2 rounded text-white transition ".concat(!files.length || !caption.trim() || isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700'),
                                    children: isLoading ? 'Publishing...' : 'Publish'
                                }, void 0, false, {
                                    fileName: "[project]/IT4409/Instagram-lite/app/blog/create/page.tsx",
                                    lineNumber: 198,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/IT4409/Instagram-lite/app/blog/create/page.tsx",
                            lineNumber: 190,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/IT4409/Instagram-lite/app/blog/create/page.tsx",
                    lineNumber: 115,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/IT4409/Instagram-lite/app/blog/create/page.tsx",
            lineNumber: 112,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/IT4409/Instagram-lite/app/blog/create/page.tsx",
        lineNumber: 111,
        columnNumber: 5
    }, this);
}
_s(CreateBlogPage, "Gm1FM1bpnOo+Oqhvndy3ZRNiJiM=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$IT4409$2f$Instagram$2d$lite$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
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

//# sourceMappingURL=IT4409_Instagram-lite_app_blog_create_page_tsx_c926485a._.js.map