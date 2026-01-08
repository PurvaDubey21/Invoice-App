import Invoice from "../models/Invoice.js";
import InvoiceItem from "../models/InvoiceItem.js";

/**
 * GET /invoice/getlist
 */
export const getList = async (req, res) => {
  try {
    const { from, to } = req.query;
    const { companyId } = req.user;

    const query = {
      companyId,
      ...(from &&
        to && {
          invoiceDate: {
            $gte: new Date(from),
            $lte: new Date(to),
          },
        }),
    };

    const invoices = await Invoice.find(query).sort({ invoiceDate: -1 });

    res.json(invoices);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch invoices" });
  }
};

/**
 * GET /invoice/getmetrics
 */
export const getMetrices = async (req, res) => {
  try {
    const { from, to } = req.query;
    const { companyId } = req.user;

    const result = await Invoice.aggregate([
      {
        $match: {
          companyId,
          invoiceDate: {
            $gte: new Date(from),
            $lte: new Date(to),
          },
        },
      },
      {
        $group: {
          _id: null,
          invoiceCount: { $sum: 1 },
          totalAmount: { $sum: "$invoiceAmount" },
        },
      },
    ]);

    res.json(
      result[0] ?? {
        invoiceCount: 0,
        totalAmount: 0,
      }
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch metrics" });
  }
};

/**
 * GET /invoice/gettrend12m
 */
export const getTrend12m = async (req, res) => {
  try {
    const { companyId } = req.user;

    const start = new Date();
    start.setMonth(start.getMonth() - 11);
    start.setDate(1);

    const trend = await Invoice.aggregate([
      {
        $match: {
          companyId,
          invoiceDate: { $gte: start },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$invoiceDate" },
            month: { $month: "$invoiceDate" },
          },
          invoiceCount: { $sum: 1 },
          amountSum: { $sum: "$invoiceAmount" },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 },
      },
    ]);

    const data = trend.map((t) => ({
      monthStart: new Date(t._id.year, t._id.month - 1, 1),
      invoiceCount: t.invoiceCount,
      amountSum: t.amountSum,
    }));

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch trend" });
  }
};

/**
 * GET /invoice/topitems
 */
export const getTopItems = async (req, res) => {
  try {
    const { from, to, topN = 5 } = req.query;
    const { companyId } = req.user;

    const items = await InvoiceItem.aggregate([
      {
        $match: {
          companyId,
          ...(from &&
            to && {
              createdAt: {
                $gte: new Date(from),
                $lte: new Date(to),
              },
            }),
        },
      },
      {
        $group: {
          _id: "$itemName",
          amountSum: { $sum: "$amount" },
        },
      },
      { $sort: { amountSum: -1 } },
    ]);

    const top = items.slice(0, topN);
    const others = items.slice(topN);

    const response = [
      ...top.map((i) => ({
        itemName: i._id ?? "Others",
        amountSum: i.amountSum,
      })),
    ];

    if (others.length) {
      response.push({
        itemName: "Others",
        amountSum: others.reduce((s, i) => s + i.amountSum, 0),
      });
    }

    res.json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch top items" });
  }
};
