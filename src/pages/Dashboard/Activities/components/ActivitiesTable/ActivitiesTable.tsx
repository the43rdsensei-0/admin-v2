import { useEffect, useState } from "react";
import { SearchBarField } from "src/components/Form/SearchBarField";
import Table from "src/components/Table/table";
import formatDate from "src/utils/formatDate";
import formatTime from "src/utils/formatTime";
import sortByDate from "src/utils/sortByDate";
import ActivityDetails from "../ActivityDetails";
import styles from "./activitiestable.module.css";

export default function ActivitiesTable ({
    activities,
    currentPage,
    totalPages,
    goToPage
}:{
    activities:any[],
    currentPage:number,
    totalPages:number,
    goToPage:Function
}) {


    const formatActivitiesTable = (activities:any[])=> {
        return activities.map((activity:any)=> {
            return [
                {
                    rowKey: `${activity.id}`,
                    actionEvent: 'row_click',
                    target: 'show_modal'
                },
                <div className={styles.activity}>{activity.category}</div>,
                <div className={styles.title}>{activity.title}</div>,
                <div className={styles.assignee}>{activity.adminUser.fullname}</div>,
                <div className={styles.date_time}>
                    <div>{formatDate(activity.createdAt)}</div> 
                    <div>{formatTime(activity.createdAt)}</div>
                </div>
            ]
        })
    }

    useEffect(()=> {
        setTableBody(formatActivitiesTable(sortByDate([...activities])!))
    }, [activities])

    const [tableBody, setTableBody] = useState<any[]>([]);
    const tableHead = [
        'Activity',
        'Title',
        'Assignee',
        'Date & Time'
    ];

    const [activityModalState, setActivityModalState] = useState({
        visible: false,
        activityId: "1"
    });

    const showModal =(activityId:string)=> {
        setActivityModalState({ visible: true, activityId: activityId });
    }

    return (
        <div className={styles.activities_table_container}>
            
            <div className={styles.filter_section}>
                <SearchBarField 
                    extraStyle={styles.search_button}
                    listToSearch={activities}
                    onSearch={(newList:any[])=> setTableBody(formatActivitiesTable(sortByDate([...newList])!))}
                />
            </div>

            <Table 
                head={tableHead}
                body={tableBody}
                action={(rowKey:string)=> showModal(rowKey)}
                currentPage={currentPage}
                totalPages={totalPages}
                goToPage={goToPage}
                emptyListMessage={"Activites by all admin users will be will be shown here"}
            />

            {
                activityModalState.visible
                ?   <ActivityDetails 
                        activity={activities.filter(activity => activity.id === activityModalState.activityId)[0]}
                        closeDetails={()=> setActivityModalState({visible: false, activityId: ""})}
                    />
                :   null
            }
        </div>
    );
}