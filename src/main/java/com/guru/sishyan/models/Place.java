package com.guru.sishyan.models;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Getter
@Setter
@Document
public class Place {
    @Id
    String id;
    String Address;
    Coordinate coordinate;
}
