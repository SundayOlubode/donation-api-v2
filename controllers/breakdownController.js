const Breakdown = require("../models/breakdownModel");
const appError = require("../utils/appError");
const Disbursement = require("../models/disburseModel");
const Cache = require("../configs/redis");
const { EmailToUsers } = require("../utils/emails");
const Users = require("../models/userModel");
const logger = require("../utils/logger");

/** GET BREAKDOWN
 */
exports.getBreakdown = async (req, res, next) => {
  try {
    let breakdown;
    breakdown = await Cache.get("breakdown");

    if (breakdown) {
      breakdown = JSON.parse(breakdown);
      return res.status(200).json({
        status: "success",
        data: {
          breakdown,
        },
      });
    }

    breakdown = await Breakdown.findOne();

    await Cache.set("breakdown", JSON.stringify(breakdown), { EX: 60 });

    return res.status(200).json({
      status: "success",
      message: "Donation Breakdown",
      data: {
        breakdown,
      },
    });
  } catch (error) {
    return next(error);
  }
};

/* POST DISBURSE
 */
exports.postDisbursed = async (req, res, next) => {
  try {
    let { amount } = req.body;
    amount = Number(amount);

    const breakdown = await Breakdown.findOne();

    if (amount > breakdown.balance) {
      throw new appError("Amount Greater Than Balance!", 400);
    }

    breakdown.disbursed += amount;
    breakdown.balance = breakdown.total - breakdown.disbursed;

    await Disbursement.create({ amount, balance: breakdown.balance });
    await breakdown.save();

    await Cache.set("breakdown", JSON.stringify(breakdown), { EX: 60 });

    setTimeout(NotifyDisbursement, 5000);

    return res.status(200).json({
      status: "success",
      message: "Disbursed successfully!",
    });
  } catch (error) {
    return next(error);
  }
};

const NotifyDisbursement = async () => {
  try {
    logger.info("DISBUREMENT CRON JOB STARTED...");
    const users = await Users.find();
    const lastDisbursed = (await Disbursement.find()).pop();
    const donationBreakdown = await Breakdown.findOne();

    const url = `${process.env.FRONTEND_URL}`;
    const donation = null;
    const breakdown = {
      balance: donationBreakdown.balance,
      disbursed: donationBreakdown.disbursed,
      amount: lastDisbursed.amount,
    };

    for (let user of users) {
      await new EmailToUsers(
        user,
        url,
        donation,
        breakdown,
      ).sendDisbursementNotification();
    }
    logger.info("DISBUREMENT CRON JOB DONE...");
  } catch (error) {
    logger.error(error);
  }
};
