import React from "react";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import { Product, ProductSchema } from "~/models/Product";
import { Formik, Field, FormikProps, FormikValues } from "formik";
import TextField from "~/components/Form/TextField";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import PaperLayout from "~/components/PaperLayout/PaperLayout";
import Typography from "@mui/material/Typography";
import API_PATHS from "~/constants/apiPaths";

const Form = (props: FormikProps<FormikValues>) => {
  const { dirty, isSubmitting, isValid, handleSubmit } = props;
  const navigate = useNavigate();
  return (
    <form onSubmit={handleSubmit} autoComplete="off">
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Field
            component={TextField}
            name="title"
            label="Title"
            fullWidth
            autoComplete="off"
            required
          />
        </Grid>
        <Grid item xs={12}>
          <Field
            component={TextField}
            name="description"
            label="Description"
            fullWidth
            autoComplete="off"
            multiline
            required
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <Field
            component={TextField}
            name="price"
            label="Price ($)"
            fullWidth
            autoComplete="off"
            required
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <Field
            component={TextField}
            name="count"
            label="Count"
            fullWidth
            autoComplete="off"
            required
          />
        </Grid>
        <Grid item container xs={12} justifyContent="space-between">
          <Button color="primary" onClick={() => navigate("/admin/products")}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={!dirty || isSubmitting || !isValid}
          >
            Save Product
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

const emptyValues: any = ProductSchema.cast({});

export default function PageProductForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = React.useState<Product | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  const onSubmit = (values: FormikValues) => {
    const formattedValues = ProductSchema.cast(values);
    const productToSave = id
      ? { ...ProductSchema.cast(formattedValues), id }
      : formattedValues;
    axios
      .put(`${API_PATHS.bff}/product`, productToSave)
      .then(() => navigate("/admin/products"));
  };

  React.useEffect(() => {
    if (!id) {
      setIsLoading(false);
      return;
    }
    axios.get(`${API_PATHS.bff}/product/${id}`).then((res) => {
      setProduct(res.data);
      setIsLoading(false);
    });
  }, [id]);

  if (isLoading) return <p>loading...</p>;

  return (
    <PaperLayout>
      <Typography component="h1" variant="h4" align="center">
        {id ? "Edit product" : "Create new product"}
      </Typography>
      <Formik
        initialValues={product || emptyValues}
        validationSchema={ProductSchema}
        onSubmit={onSubmit}
      >
        {(props: FormikProps<FormikValues>) => <Form {...props} />}
      </Formik>
    </PaperLayout>
  );
}
