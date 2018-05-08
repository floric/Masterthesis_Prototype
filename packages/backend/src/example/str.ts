import { Valueschema } from '../graphql/resolvers/dataset';

export const passagesSchemas: Array<Valueschema> = [
  {
    name: 'passage_id',
    type: 'String',
    required: true,
    fallback: '',
    unique: true
  },
  {
    name: 'pass_day',
    type: 'Number',
    required: true,
    fallback: '1',
    unique: false
  },
  {
    name: 'pass_month',
    type: 'Number',
    required: true,
    fallback: '1',
    unique: false
  },
  {
    name: 'pass_year',
    type: 'Number',
    required: true,
    fallback: '1',
    unique: false
  },
  {
    name: 'master_firstname',
    type: 'String',
    required: true,
    fallback: '',
    unique: false
  },
  {
    name: 'master_patronymic',
    type: 'String',
    required: false,
    fallback: '',
    unique: false
  },
  {
    name: 'master_article',
    type: 'String',
    required: false,
    fallback: '',
    unique: false
  },
  {
    name: 'master_surname',
    type: 'String',
    required: false,
    fallback: '',
    unique: false
  },
  {
    name: 'domicile_city',
    type: 'String',
    required: true,
    fallback: '',
    unique: false
  },
  {
    name: 'domicile_region',
    type: 'String',
    required: true,
    fallback: '',
    unique: false
  },
  {
    name: 'domicile_country_1763',
    type: 'String',
    required: true,
    fallback: '',
    unique: false
  },
  {
    name: 'domicile_country_1795',
    type: 'String',
    required: true,
    fallback: '',
    unique: false
  },
  {
    name: 'domicile_country_1815',
    type: 'String',
    required: true,
    fallback: '',
    unique: false
  },
  {
    name: 'domicile_country_1830',
    type: 'String',
    required: true,
    fallback: '',
    unique: false
  },
  {
    name: 'domicile_latitude',
    type: 'String',
    required: true,
    fallback: '',
    unique: false
  },
  {
    name: 'domicile_longitude',
    type: 'String',
    required: true,
    fallback: '',
    unique: false
  },
  {
    name: 'domicile_decLatitude',
    type: 'Number',
    required: true,
    fallback: '0',
    unique: false
  },
  {
    name: 'domicile_decLongitude',
    type: 'Number',
    required: true,
    fallback: '0',
    unique: false
  },
  {
    name: 'departure_city',
    type: 'String',
    required: true,
    fallback: '',
    unique: false
  },
  {
    name: 'departure_region',
    type: 'String',
    required: true,
    fallback: '',
    unique: false
  },
  {
    name: 'departure_country_1763',
    type: 'String',
    required: true,
    fallback: '',
    unique: false
  },
  {
    name: 'departure_country_1795',
    type: 'String',
    required: true,
    fallback: '',
    unique: false
  },
  {
    name: 'departure_country_1815',
    type: 'String',
    required: true,
    fallback: '',
    unique: false
  },
  {
    name: 'departure_country_1830',
    type: 'String',
    required: true,
    fallback: '',
    unique: false
  },
  {
    name: 'departure_coords_latitude',
    type: 'String',
    required: true,
    fallback: '',
    unique: false
  },
  {
    name: 'departure_coords_longitude',
    type: 'String',
    required: true,
    fallback: '',
    unique: false
  },
  {
    name: 'departure_coords_decLatitude',
    type: 'Number',
    required: true,
    fallback: '0',
    unique: false
  },
  {
    name: 'departure_coords_decLongitude',
    type: 'Number',
    required: true,
    fallback: '0',
    unique: false
  },
  {
    name: 'destination_city',
    type: 'String',
    required: true,
    fallback: '',
    unique: false
  },
  {
    name: 'destination_region',
    type: 'String',
    required: true,
    fallback: '',
    unique: false
  },
  {
    name: 'destination_country_1763',
    type: 'String',
    required: true,
    fallback: '',
    unique: false
  },
  {
    name: 'destination_country_1795',
    type: 'String',
    required: true,
    fallback: '',
    unique: false
  },
  {
    name: 'destination_country_1815',
    type: 'String',
    required: true,
    fallback: '',
    unique: false
  },
  {
    name: 'destination_country_1830',
    type: 'String',
    required: true,
    fallback: '',
    unique: false
  },
  {
    name: 'destination_coords_latitude',
    type: 'String',
    required: true,
    fallback: '',
    unique: false
  },
  {
    name: 'destination_coords_longitude',
    type: 'String',
    required: true,
    fallback: '',
    unique: false
  },
  {
    name: 'destination_coords_decLatitude',
    type: 'Number',
    required: true,
    fallback: '0',
    unique: false
  },
  {
    name: 'destination_coords_decLongitude',
    type: 'Number',
    required: true,
    fallback: '0',
    unique: false
  },
  {
    name: 'commodities_number',
    type: 'Number',
    required: true,
    fallback: '1',
    unique: false
  },
  {
    name: 'tonnes',
    type: 'Number',
    required: true,
    fallback: '0',
    unique: false
  }
];

export const commoditiesSchemas: Array<Valueschema> = [
  {
    name: 'commodity_id',
    type: 'String',
    required: true,
    fallback: '',
    unique: true
  },
  {
    name: 'passage_id',
    type: 'String',
    required: true,
    fallback: '',
    unique: false
  },
  {
    name: 'pass_day',
    type: 'Number',
    required: true,
    fallback: '1',
    unique: false
  },
  {
    name: 'pass_month',
    type: 'Number',
    required: true,
    fallback: '1',
    unique: false
  },
  {
    name: 'pass_year',
    type: 'Number',
    required: true,
    fallback: '1',
    unique: false
  },
  {
    name: 'master_firstname',
    type: 'String',
    required: true,
    fallback: '',
    unique: false
  },
  {
    name: 'master_patronymic',
    type: 'String',
    required: false,
    fallback: '',
    unique: false
  },
  {
    name: 'master_article',
    type: 'String',
    required: false,
    fallback: '',
    unique: false
  },
  {
    name: 'master_surname',
    type: 'String',
    required: false,
    fallback: '',
    unique: false
  },
  {
    name: 'domicile_city',
    type: 'String',
    required: true,
    fallback: '',
    unique: false
  },
  {
    name: 'domicile_region',
    type: 'String',
    required: true,
    fallback: '',
    unique: false
  },
  {
    name: 'domicile_country_1763',
    type: 'String',
    required: true,
    fallback: '',
    unique: false
  },
  {
    name: 'domicile_country_1795',
    type: 'String',
    required: true,
    fallback: '',
    unique: false
  },
  {
    name: 'domicile_country_1815',
    type: 'String',
    required: true,
    fallback: '',
    unique: false
  },
  {
    name: 'domicile_country_1830',
    type: 'String',
    required: true,
    fallback: '',
    unique: false
  },
  {
    name: 'domicile_latitude',
    type: 'String',
    required: true,
    fallback: '',
    unique: false
  },
  {
    name: 'domicile_longitude',
    type: 'String',
    required: true,
    fallback: '',
    unique: false
  },
  {
    name: 'domicile_decLatitude',
    type: 'Number',
    required: true,
    fallback: '0',
    unique: false
  },
  {
    name: 'domicile_decLongitude',
    type: 'Number',
    required: true,
    fallback: '0',
    unique: false
  },
  {
    name: 'departure_city',
    type: 'String',
    required: true,
    fallback: '',
    unique: false
  },
  {
    name: 'departure_region',
    type: 'String',
    required: true,
    fallback: '',
    unique: false
  },
  {
    name: 'departure_country_1763',
    type: 'String',
    required: true,
    fallback: '',
    unique: false
  },
  {
    name: 'departure_country_1795',
    type: 'String',
    required: true,
    fallback: '',
    unique: false
  },
  {
    name: 'departure_country_1815',
    type: 'String',
    required: true,
    fallback: '',
    unique: false
  },
  {
    name: 'departure_country_1830',
    type: 'String',
    required: true,
    fallback: '',
    unique: false
  },
  {
    name: 'departure_coords_latitude',
    type: 'String',
    required: true,
    fallback: '',
    unique: false
  },
  {
    name: 'departure_coords_longitude',
    type: 'String',
    required: true,
    fallback: '',
    unique: false
  },
  {
    name: 'departure_coords_decLatitude',
    type: 'Number',
    required: true,
    fallback: '0',
    unique: false
  },
  {
    name: 'departure_coords_decLongitude',
    type: 'Number',
    required: true,
    fallback: '0',
    unique: false
  },
  {
    name: 'destination_city',
    type: 'String',
    required: true,
    fallback: '',
    unique: false
  },
  {
    name: 'destination_region',
    type: 'String',
    required: true,
    fallback: '',
    unique: false
  },
  {
    name: 'destination_country_1763',
    type: 'String',
    required: true,
    fallback: '',
    unique: false
  },
  {
    name: 'destination_country_1795',
    type: 'String',
    required: true,
    fallback: '',
    unique: false
  },
  {
    name: 'destination_country_1815',
    type: 'String',
    required: true,
    fallback: '',
    unique: false
  },
  {
    name: 'destination_country_1830',
    type: 'String',
    required: true,
    fallback: '',
    unique: false
  },
  {
    name: 'destination_coords_latitude',
    type: 'String',
    required: true,
    fallback: '',
    unique: false
  },
  {
    name: 'destination_coords_longitude',
    type: 'String',
    required: true,
    fallback: '',
    unique: false
  },
  {
    name: 'destination_coords_decLatitude',
    type: 'Number',
    required: true,
    fallback: '0',
    unique: false
  },
  {
    name: 'destination_coords_decLongitude',
    type: 'Number',
    required: true,
    fallback: '0',
    unique: false
  },
  {
    name: 'measure',
    type: 'String',
    required: true,
    fallback: '',
    unique: false
  },
  {
    name: 'Commodity',
    type: 'String',
    required: true,
    fallback: '',
    unique: false
  },
  {
    name: 'quantity',
    type: 'Number',
    required: true,
    fallback: '1',
    unique: false
  },
  {
    name: 'tonnes',
    type: 'Number',
    required: true,
    fallback: '0',
    unique: false
  }
];
