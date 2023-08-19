import styles from "./transactionsmetrics.module.css";
import Card from "../../../../../components/Cards/card";
import GridList from "../../../../../components/Lists/GridList";
import { ReactComponent as IconCube } from "../../../../../assets/icons/icon-cube.svg"
import { ReactComponent as IconCheck } from "../../../../../assets/icons/icon-ok.svg"
import { ReactComponent as IconCancel } from "../../../../../assets/icons/icon-cancel.svg"
import { ReactComponent as IconClock } from "../../../../../assets/icons/icon-clock.svg"
import { useEffect, useState } from "react";
import socketConn from "src/lib/socketConn";
import { useUserStateValue } from "src/features/user/atom";

export default function TransactionMetrics() {
    
    const userState = useUserStateValue()

    const [metrics, setMetrics] = useState({
        success: "_",
        failed: "_",
        pending: "_",
        processing: "_",
        total: "_"
    })

    useEffect(()=> {    
        socketConn.emit("fetch_transactions_metric", { userId: userState.userData.id })
        .on("transactions_metric", (response)=> {
            setMetrics({
                success: response.data?.successfulTransactions,
                failed: response.data?.failedTransactions,
                pending: response.data?.pendingTransactions,
                processing: response.data?.processingTransactions,
                total: response.data?.totalTransactions,
            })
        })
    }, [userState.userData.id])
    
    return (
        <div className={styles.metrics_container}>
            <GridList columns={3}>
                <Card extraStyle={styles.metric_card}>
                    <div className={styles.metric_card_content}>
                        <IconCube />
                        <div className={styles.content}>
                            <div className={styles.label}>All Transactions</div>
                            <div className={styles.value}>
                                { metrics.total}
                            </div>
                        </div>
                    </div>
                </Card>

                <Card extraStyle={styles.metric_card}>
                    <div className={styles.metric_card_content}>
                        <IconCheck />
                        <div className={styles.content}>
                            <div className={styles.label}>Successful</div>
                            <div className={styles.value}>
                                { metrics.success }
                            </div>
                        </div>
                    </div>
                </Card>

                <Card extraStyle={styles.metric_card}>
                    <div className={styles.metric_card_content}>
                        <IconCancel />
                        <div className={styles.content}>
                            <div className={styles.label}>Failed</div>
                            <div className={styles.value}>
                                { metrics.failed }
                            </div>
                        </div>
                    </div>
                </Card>

                <Card extraStyle={styles.metric_card}>
                    <div className={styles.metric_card_content}>
                        <IconClock />
                        <div className={styles.content}>
                            <div className={styles.label}>Pending</div>
                            <div className={styles.value}>
                                { metrics.pending }
                            </div>
                        </div>
                    </div>
                </Card>

                <Card extraStyle={styles.metric_card}>
                    <div className={styles.metric_card_content}>
                        <IconClock />
                        <div className={styles.content}>
                            <div className={styles.label}>Processing</div>
                            <div className={styles.value}>
                                { metrics.processing }
                            </div>
                        </div>
                    </div>
                </Card>
            </GridList>
        </div>
    );
}