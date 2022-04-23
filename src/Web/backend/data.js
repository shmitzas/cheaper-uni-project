import { createPool } from 'mariadb';

const { ENV } = process.env;

/**
 * @class DataInterface
 */
class DataInterface {
    async getProducts() {
        throw new Error("Method 'getProducts()' must be implemented.");
    }
    async getShops() {
        throw new Error("Method 'getShops()' must be implemented.");
    }
}

/**
 * @class DevDB
 * @extends {DataInterface}
 */
class DevDB extends DataInterface {
    domains = [
        'https://rimi.lt',
        'https://maxima.lt'
    ];

    shop_icon_urls = [
        'https://upload.wikimedia.org/wikipedia/en/thumb/c/c7/Rimi_Baltic_Logo.svg/220px-Rimi_Baltic_Logo.svg.png',
        'https://maxima.lt/build/website/images/maxima-logo.4153f9e6.svg'
    ];

    getProducts() {
        const product_urls = [
            'https://www.rimi.lt/e-parduotuve/lt/produktai/vaisiai-darzoves-ir-geles/vaisiai-ir-uogos/bananai/bananai-1-kg/p/270939',
            'https://www.rimi.lt/e-parduotuve/lt/produktai/bakaleja/kava-ir-kakava/kavos-kapsules/kavos-kapsules-aroma-gold-oat-flat-white-162g/p/1005450'
        ];

        return [
            {
                pid: 1,
                name: "Bananai",
                product_icon_url: 'https://rimibaltic-res.cloudinary.com/image/upload/b_white,c_fit,f_auto,h_480,q_auto,w_480/d_ecommerce:backend-fallback.png/MAT_270939_KGM_LT',
                shops: [
                    {
                        sid: 1,
                        url: this.domains[0],
                        old_price: 0,
                        price: 1.00,
                        product_url: product_urls[0],
                        shop_icon_url: this.shop_icon_urls[0],
                        last_scan: '2022-04-07'
                    },
                    {
                        sid: 2,
                        url: this.domains[1],
                        old_price: 0,
                        price: 1.00,
                        product_url: product_urls[0],
                        shop_icon_url: this.shop_icon_urls[1],
                        last_scan: '2022-04-07'
                    }
                ]
            },
            {
                pid: 2,
                name: "Kava",
                product_icon_url: 'https://rimibaltic-res.cloudinary.com/image/upload/b_white,c_fit,f_auto,h_480,q_auto,w_480/d_ecommerce:backend-fallback.png/MAT_1005450_PCE_LT',
                shops: [
                    {
                        sid: 1,
                        url: this.domains[0],
                        old_price: 0,
                        price: 1.00,
                        product_url: product_urls[1],
                        shop_icon_url: this.shop_icon_urls[0],
                        last_scan: '2022-04-07'
                    },
                    {
                        sid: 2,
                        url: this.domains[1],
                        old_price: 0,
                        price: 1.00,
                        product_url: product_urls[1],
                        shop_icon_url: this.shop_icon_urls[1],
                        last_scan: '2022-04-07'
                    }
                ]
            }
        ];
    }

    getShops() {
        return [
            {
                sid: 1,
                url: this.domains[0],
                shop_icon_url: this.shop_icon_urls[0]
            },
            {
                sid: 2,
                url: this.domains[1],
                shop_icon_url: this.shop_icon_urls[1]
            }
        ];
    }
}

/**
 * @class RemoteDB
 * @extends {DataInterface}
 */
class RemoteDB extends DataInterface {
    #pool;

    constructor() {
        const { DB_HOST, DB_PORT, DB_NAME, DB_USR, DB_PSW } = process.env;
        this.pool = createPool({
            host: DB_HOST,
            port: DB_PORT,
            database: DB_NAME,
            user: DB_USR,
            password: DB_PSW,
            connectionLimit: 5
        });
    }

    getProducts() {
        return {
            hello: "world"
        };
    }
}

export default function() {
    return (ENV == "dev") ? new DevDB() : new RemoteDB();
}

// async function asyncRead() {
//     let conn;
//     try {
//         conn = await pool.getConnection();
//         const rows = await conn.query("select * from hello_world");
//         rows.forEach(row => {
//             console.log(row);
//         });
//         await conn.end();
//         process.exit(0);
//     } catch (err) {
//         throw err;
//     } finally {
//         if (conn) return conn.end();
//     }
// }

// asyncRead().catch(console.error);
