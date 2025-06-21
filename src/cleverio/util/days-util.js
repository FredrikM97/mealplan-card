/**
 * Days/Bitmask Utility Group
 */
const DaysUtil = {
    DAYS: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    // Group labels and masks for UI
    DAY_GROUPS: [
        { mask: 0b00011111, label: "Weekdays" }, // Monday–Friday
        { mask: 0b1100000, label: "Weekend" },   // Saturday–Sunday
        { mask: 0b1111111, label: "Every day" },
    ],
    getUIDays() {
        // UI order: Monday-Sunday
        return [...DaysUtil.DAYS.slice(1), DaysUtil.DAYS[0]];
    },
    getDayBit(day) {
        return 1 << DaysUtil.DAYS.indexOf(day);
    },
    daysArrayToBitmask(days) {
        return days.reduce((mask, day) => mask | DaysUtil.getDayBit(day), 0);
    },
    bitmaskToDaysArray(mask) {
        return DaysUtil.DAYS.filter((_, i) => mask & (1 << i));
    },
    getDaysLabel(mask) {
        for (const group of DaysUtil.DAY_GROUPS) {
            if (mask === group.mask) return group.label;
        }
        // If only one day, return full name
        const days = DaysUtil.DAYS.filter((_, i) => mask & (1 << i));
        if (days.length === 1) return days[0];
        // Otherwise, return short names in Monday-Sunday order
        return days.map(day => day.slice(0,3)).join(', ');
    },
};

export default DaysUtil;
