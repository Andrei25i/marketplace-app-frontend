import { ActionIcon, TextInput } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import React, { useEffect, useState } from "react";
import {
  Form,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";

const SearchBar = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryFromUrl = searchParams.get("q") ?? "";
  const [searchQuery, setSearchQuery] = useState(queryFromUrl);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setSearchQuery(queryFromUrl);
  }, [queryFromUrl]);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);

    if (!value.trim()) {
      const nextParams = new URLSearchParams(searchParams);
      nextParams.delete("q");
      nextParams.delete("page");
      setSearchParams(nextParams, { replace: true });
    }
  };

  const handleSearch = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmed = searchQuery.trim();

    const nextParams = new URLSearchParams(searchParams);

    if (trimmed) {
      nextParams.set("q", trimmed);
    } else {
      nextParams.delete("q");
    }
    nextParams.delete("page");

    if (location.pathname !== "/search") {
      navigate(`/search?${nextParams.toString()}`);
    } else {
      setSearchParams(nextParams);
    }
  };

  return (
    <Form
      onSubmit={handleSearch}
      style={{ flexGrow: 1, maxWidth: "500px", margin: "0 24px" }}
    >
      <TextInput
        placeholder="Caută anunțuri..."
        value={searchQuery}
        onChange={(e) => handleSearchChange(e.currentTarget.value)}
        radius="md"
        rightSection={
          <ActionIcon
            type="submit"
            radius="md"
            color="primary"
            variant="subtle"
          >
            <IconSearch size={18} />
          </ActionIcon>
        }
      />
    </Form>
  );
};

export default SearchBar;
