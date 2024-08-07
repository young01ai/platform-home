/** @type {import('next').NextConfig} */

// const withBundleAnalyzer = require('@next/bundle-analyzer')({  
//     enabled: process.env.ANALYZE === 'true'  
// })  

// const url = 'http://localhost:8000'
const nextConfig = {
    output: 'export',
    images: { unoptimized: true },
    // compress: false,
    // productionBrowserSourceMaps: true
    // async rewrites() {
    //     return [
    //         {
    //             source: '/token',
    //             destination: 'https://passport.feishu.cn/suite/passport/oauth/token',
    //         },
    //         {
    //             source: '/userinfo',
    //             destination: 'https://passport.feishu.cn/suite/passport/oauth/userinfo',
    //         },
    //         {
    //             source: '/api/:slug*',
    //             destination: 'https://api.lingyiwanwu.com/:slug*',
    //         },
    //     ]
    // },
    // async redirects() {
    //     return [
    //         {
    //             source: '/console/api/:slug*',
    //             destination: 'http://localhost/console/api/:slug*',
    //             permanent: true,
    //         },
    //     ]
    // },
    // async redirects() {
    //     return [
    //         {
    //             source: '/v1/:slug*',
    //             destination: url,
    //             permanent: true,
    //         },
    //     ]
    // },
    webpack(config) {
        config.module.rules.push({
          test: /\.svg$/,
          use: ["@svgr/webpack"]
        }) // 针对 SVG 的处理规则
    
        return config
    },
}

// module.exports = withBundleAnalyzer(nextConfig)
module.exports = nextConfig