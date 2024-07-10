import React from "react";
import { useState } from "react";
import { Container, Table } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { getUserAddressesAdmin } from "../../../api/address-service";
import { toast } from "../../../helpers/functions/swal";
import { useEffect } from "react";
import Loading from "../../common/loading/loading";

const AdminUserEditAddresses = () => {
  const [addressesData, setAddressesData] = useState([]);
  const [loading, setLoading] = useState(false);

  const { userId } = useParams();

  const loadData = async () => {
    setLoading(true);
    try {
      const resp = await getUserAddressesAdmin(userId);
      setAddressesData(resp.data);
    } catch (err) {
      toast(err.response.data.message, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(0);
    // eslint-disable-next-line
  }, []);

  return loading ? (
    <Loading />
  ) : (
    <Container>
      <Table responsive="md">
        <tbody className="table-group">
          {addressesData.map((details, i) => (
            <tr key={i}>
              <td style={{ textTransform: "capitalize" }}>
                <b>{details.title}</b>
              </td>
              <td>
                {details.address}, {details.province}, {details.city},{" "}
                {details.country}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default AdminUserEditAddresses;
