import { UserProfile } from "@/components/profile";

function Profile() {
  const dataJson = [
    {
      label: "name",
      placeholder: "John Smith",
      value: "",
      type: "text",
      didabled: true,
    },
    {
      label: "Email",
      placeholder: "John@gmail.com",
      value: "",
      type: "email",
      didabled: true,
    },
    {
      label: "Registration Number",
      placeholder: "0000000000",
      value: "",
      type: "text",
      didabled: true,
    },
  ];

  return <UserProfile dataJson={dataJson} />;
}

export default Profile;
