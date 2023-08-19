import { fetchAdminUserAction } from "src/features/admin-users/action"

export default function formatActivities(allActivities:any[]) {
    return new Promise(async (resolve, reject)=> {

        if(!allActivities.length) resolve(allActivities);

        const formatted:any[] = []

        allActivities.forEach(async (activity)=> {
            await fetchAdminUserAction(activity?.assignee)
            .then(async (data:any)=> {
                let newActivity = {...activity}

                if(activity.category === "transaction management") {
                    newActivity.link = `/dashboard/transactions/${activity.item}`;
                }

                if(activity.category === "admin access management") {
                    newActivity.link = `/dashboard/admin-access/user/${activity.item}`;
                }
                
                newActivity.adminUser = {};
                newActivity.adminUser.fullname = data.user.fullname;
                newActivity.adminUser.imageURL = data.user.profileImageURL;
                newActivity.adminUser.email = data.user.email;
                newActivity.adminUser.phoneNumber = data.user.phoneNumber;
                newActivity.id = activity._id;
                newActivity.date = activity.createdAt

                formatted.unshift(newActivity)

                if(formatted.length === allActivities.length) resolve(formatted)
            })
            .catch((error)=> {
                console.log(error)
                reject({status: 500, message: 'There was an error formatting activities', errorMessage: error})
            })
        })
    })
}