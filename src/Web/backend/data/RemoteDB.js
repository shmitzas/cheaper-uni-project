import { Sequelize, DataTypes } from 'sequelize';
import DataInterface from './DataInterface.js';

const modelOpt = {
    timestamps: false,
    freezeTableName: true
};

export default class RemoteDB extends DataInterface {
    #connConfig;

    constructor(host, port, name, user, passw) {
        super();
        this._sq = new Sequelize(
            `mariadb://${user}:${passw}@${host}:${port}/${name}`
        );
        this._models = {}
        this._models.products = this._sq.define('product', {
            pid: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            name: {
                type: DataTypes.STRING(100),
                allowNull: true
            },
            productIconUrl: {
                type: DataTypes.STRING(1024),
                allowNull: false,
                defaultValue: 'http://www.domain.lt/product_image_path',
                field: 'image_url'
            }
        }, modelOpt);
        this._models.shops = this._sq.define('shop', {
            sid: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            name: {
                type: DataTypes.STRING(50),
                allowNull: true
            },
            url: {
                type: DataTypes.STRING(1024),
                allowNull: false,
                defaultValue: 'http://www.domain.lt/product_image_path',
                field: 'domain'
            },
            shopIconUrl: {
                type: DataTypes.STRING(1024),
                allowNull: false,
                defaultValue: 'http://www.domain.lt/product_image_path',
                field: 'image_url'
            }
        }, modelOpt);
        this._models.productPrices = this._sq.define('product_prices', {
            pid: {
                type: DataTypes.INTEGER,
                primaryKey: true
            },
            sid: {
                type: DataTypes.INTEGER,
                primaryKey: true
            },
            name: {
                type: DataTypes.STRING(50),
                allowNull: true
            },
            url: {
                type: DataTypes.STRING(1024),
                allowNull: false,
                defaultValue: 'http://www.domain.lt/product_image_path',
                field: 'domain'
            },
            shopIconUrl: {
                type: DataTypes.STRING(1024),
                allowNull: false,
                defaultValue: 'http://www.domain.lt/product_image_path',
                field: 'shop_image_url'
            },
            productUrl: {
                type: DataTypes.TEXT,
                allowNull: true,
                field: 'product_url'
            },
            lastScan: {
                type: DataTypes.TIME,
                primaryKey: true,
                field: 'last_scan'
            },
            price: {
                type: DataTypes.DECIMAL
            }
        }, modelOpt);

        this._models.products.belongsTo(this._models.productPrices, {
            as: 'shops',
            foreignKey: {
                name: 'pid',
                allowNull: false
            }
        });

        try {
            this._sq.sync();
        } catch(err) {
            throw err;
        }
    }

    /**
     * Retrieve list of products with their prices from remote DB
     *
     * @param {Number} greater Lowest price in selected price range
     * @param {Number} less    Highest price in selected price range
     * @param {Number} limit   Product count in page. 0 -> no limit
     * @param {Number} page    Page number
     * @returns array JSON list of products and their prices in shops
     */
    async getProducts(greater, less, limit, page) {
        const qOpt = {
            include: {
                model: this._models.productPrices,
                as: 'shops'
            },
            ...(this.#createPaging(limit, page))
        };

        try {
            return await this._models.products.findAll(qOpt);
            // res = res.map(p => )
        } catch (err) {
            throw err;
        }
    }

    /**
     * Retrieve list of shops from remote DB
     *
     * @param {Number} limit   Product count in page. 0 -> no limit
     * @param {Number} page    Page number
     * @returns array JSON list of products and their prices in shops
     */
    async getShops(limit, page) {
        const qOpt = {
            ...(this.#createPaging(limit, page))
        };

        try {
            return await this._models.shops.findAll(qOpt);
        } catch (err) {
            throw err;
        }
    }

    /**
     * Retrieve list of shops from remote DB
     *
     * @param {Number} limit   Product count in page. 0 -> no limit
     * @param {Number} page    Page number
     * @returns array JSON list of products and their prices in shops
     */
    async getTags(limit, page) {
        let res = [];

        try {
            const conn = await createConnection(this.#connConfig);
            const tagQuery = queries[3] + this.#createPaging(limit, page);
            res = (await conn.query(tagQuery)).slice(0);
            await conn.end();
        } catch (err) {
            throw err;
        }

        return res;
    }

    /**
     * Retrieves single product with all it's prices.
     *
     * @param {Number} id pid (product ID)
     * @returns Object JSON formatted product with its prices in shops
     */
    async getProduct(id) {
        let res = null;

        try {
            const conn = await createConnection(this.#connConfig);
            const queryProduct = queries[4];
            res = (await conn.query(queryProduct, id))[0];

            res.shops = await conn.query(queries[1], id);

            await conn.end();
        } catch (err) {
            throw err;
        }

        return res;
    }

    /**
     * Retrieves single shop.
     *
     * @param {Number} id sid (shop ID)
     * @returns Object JSON formatted shop
     */
    async getShop(id) {
        let res = null;

        try {
            const conn = await createConnection(this.#connConfig);
            const queryProduct = queries[5];
            res = (await conn.query(queryProduct, id))[0];

            await conn.end();
        } catch (err) {
            throw err;
        }

        return res;
    }

    /**
     * Retrieves single tag.
     *
     * @param {Number} id sid (shop ID)
     * @returns Object JSON formatted shop
     */
    async getTag(id) {
        let res = null;

        try {
            const conn = await createConnection(this.#connConfig);
            const queryProduct = queries[6];
            res = (await conn.query(queryProduct, id))[0];

            await conn.end();
        } catch (err) {
            throw err;
        }

        return res;
    }

    #createPaging(limit, page) {
        return limit && {
            limit: limit,
            ...(page && { offset: limit * page})
        };
    }
}
