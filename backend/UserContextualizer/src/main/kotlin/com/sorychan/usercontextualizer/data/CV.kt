package com.sorychan.usercontextualizer.data

import jakarta.persistence.*

@Entity
@Table(name="cv_info")
class CV(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long? = null,

    @Column(name = "file_name", nullable = false)
    var fileName: String,

    @Column(name = "user_id", nullable = false)
    var userId: Long
)
