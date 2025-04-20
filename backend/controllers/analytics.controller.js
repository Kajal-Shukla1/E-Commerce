import User from "../models/user.model.js";
import Product from "../models/product.model.js";
import Order from "../models/order.model.js";

export const adminAnalytics = async (req, res) => {
    try {
        const analyticsData = await getAnalyticsData(); 

        const endDate = new Date();
        const startDate = new Date(endDate.getTime()- 7 * 24 * 60 * 60 * 1000)

        const dailySalesDate = await getDailySalesData(startDate, endDate);

        res.json({
            analyticsData,
            dailySalesDate,
        })
    } catch (error) {
        console.error(`admin analytics error: ${error.message}`);
        return res.status(500).json({ message: 'adminAnalytics error' ,error: error.message});        
    }
}


async function getAnalyticsData() {
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();

    const salesData = await Order.aggregate([
        {
            $group: {
                _id: null,
                totalRevenue: { $sum: "$totalAmount" },
                totalSales: { $sum: 1 },
            },
        },
    ]);

    const {totalSales, totalRevenue} = salesData.length > 0 ? salesData[0] : { totalSales: 0, totalRevenue: 0 };

    return {
        users:totalUsers,
        products:totalProducts,
        totalSales,
        totalRevenue
    }
}


async function getDailySalesData(startDate, endDate) {
    const dailySalesData = await Order.aggregate([
        {
            $match: {
                createdAt: {
                    $gte: startDate,
                    $lt: endDate,
                },
            },
        },
        {
            $group: {
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                totalSales: { $sum: 1 },
                totalRevenue: { $sum: "$totalAmount" },
            },
        },
        {
            $sort: { _id: 1 },
        },
    ]);
    const dateArray = getDateInRange(startDate, endDate);

    return dateArray.map(date => {
        const foundData = dailySalesData.find(item => item._id === date);

        return {
            date,
            sales: foundData ? foundData.sales : 0,
            revenue: foundData ? foundData.revenue : 0,
        }
    })
}


function getDateInRange(startDate, endDate) {
    const dateArray = [];
    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
        dateArray.push(currentDate.toISOString().split('T')[0]);
        currentDate.setDate(currentDate.getDate() + 1);
    }
    return dateArray;
}


