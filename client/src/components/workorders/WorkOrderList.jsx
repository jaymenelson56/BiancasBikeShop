import { useEffect, useState } from "react";
import { Button, Input, Table } from "reactstrap";
import { completeWorkOrder, deleteIncompleteWorkOrder, getIncompleteWorkOrders, updateWorkOrder } from "../../managers/workOrderManager";
import { Link } from "react-router-dom";
import { getUserProfiles } from "../../managers/userProfileManager";


export default function WorkOrderList({ loggedInUser }) {
    const [mechanics, setMechanics] = useState([]);
    const [workOrders, setWorkOrders] = useState([]);

    useEffect(() => {
        getIncompleteWorkOrders().then(setWorkOrders);
    }, []);

    useEffect(() => {
        getIncompleteWorkOrders().then(setWorkOrders);
        getUserProfiles().then(setMechanics);
    }, []);

    const assignMechanic = (workOrder, mechanicId) => {
        const clone = structuredClone(workOrder);
        clone.userProfileId = mechanicId || null;
        updateWorkOrder(clone).then(() => {
            getIncompleteWorkOrders().then(setWorkOrders);
        });
    };

    const handleCompleteWorkOrder = (workOrderId) => {
        completeWorkOrder(workOrderId).then(() => {
            getIncompleteWorkOrders().then(setWorkOrders);
        });

        };

        const handleDeleteWorkOrder = (workOrderId) => {
            deleteIncompleteWorkOrder(workOrderId).then(() => {
                getIncompleteWorkOrders().then(setWorkOrders);
            });

        //In the action column add another red that uses the data acess function from workorder manager to delete a workorder
    }

    return (
        <>
            <h2>Open Work Orders</h2>
            <Link to="/workorders/create">New Work Order</Link>
            <Table>
                <thead>
                    <tr>
                        <th>Owner</th>
                        <th>Brand</th>
                        <th>Color</th>
                        <th>Description</th>
                        <th>DateSubmitted</th>
                        <th>Mechanic</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {workOrders.map((wo) => (
                        <tr key={wo.id}>
                            <th scope="row">{wo.bike.owner.name}</th>
                            <td>{wo.bike.brand}</td>
                            <td>{wo.bike.color}</td>
                            <td>{wo.description}</td>
                            <td>{new Date(wo.dateInitiated).toLocaleDateString()}</td>
                            <td>
                                <Input
                                    type="select"
                                    onChange={(e) => {
                                        assignMechanic(wo, parseInt(e.target.value));
                                    }}
                                    value={wo.userProfileId || 0}
                                >
                                    <option value="0">Choose mechanic</option>
                                    {mechanics.map((m) => (
                                        <option
                                            key={m.id}
                                            value={m.id}
                                        >{`${m.firstName} ${m.lastName}`}</option>
                                    ))}
                                </Input>
                            </td>
                            <td>
                                {wo.userProfile && (
                                    <Button
                                        onClick={() => handleCompleteWorkOrder(wo.id)}
                                        color="success"
                                    >
                                        Mark as Complete
                                    </Button>
                                )}
                                <Button
                                    onClick={() => handleDeleteWorkOrder(wo.id)}
                                    color="danger"
                                >
                                    Delete
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </>
    );
}