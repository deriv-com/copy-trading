import { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const getOptions = (type) => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            display: false,
        },
        title: {
            display: false,
        },
    },
    scales: {
        y: {
            beginAtZero: true,
            ticks: {
                precision: 0,
            },
            title: {
                display: true,
                text: "No. of trades",
                font: {
                    size: 12,
                    weight: "bold",
                },
            },
        },
        x: {
            title: {
                display: true,
                text: type === "monthly" ? "Month" : "Year",
                font: {
                    size: 12,
                    weight: "bold",
                },
            },
        },
    },
});

const ProfitableChart = ({ data = {}, type = "monthly" }) => {
    const chartRef = useRef(null);

    const formatLabel = (key) => {
        if (type === "monthly") {
            const [year, month] = key.split("-");
            const date = new Date(`${year}-${month}-01`);
            return `${date.toLocaleString("default", {
                month: "short",
            })} ${year}`;
        }
        return key; // Year is already in correct format
    };

    const sortedKeys = Object.keys(data).sort();

    const chartData = {
        labels: sortedKeys.map(formatLabel),
        datasets: [
            {
                data: sortedKeys.map((key) => data[key]),
                borderColor: "#0E4DFF",
                backgroundColor: "rgba(14, 77, 255, 0.1)",
                tension: 0.4,
                fill: true,
                pointRadius: 4,
                pointBackgroundColor: "#FF444F",
                pointBorderColor: "#fff",
                pointBorderWidth: 2,
            },
        ],
    };

    useEffect(() => {
        // Force chart update when data changes
        if (chartRef.current) {
            chartRef.current.update();
        }
    }, [data, type]);

    return (
        <div className="h-[300px] w-full">
            <Line ref={chartRef} options={getOptions(type)} data={chartData} />
        </div>
    );
};

ProfitableChart.propTypes = {
    data: PropTypes.objectOf(PropTypes.number).isRequired,
    type: PropTypes.oneOf(["monthly", "yearly"]),
};

export default ProfitableChart;
